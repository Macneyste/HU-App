import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { MOCK_USER } from '../data/mockData';
import { platformStorage } from '../services/platformStorage';
import type { AuthState, User, UserRole } from '../types';

interface BiometricSession {
  user: User;
  token: string;
  refreshToken: string | null;
}

export interface AuthActions {
  login: (
    identifier: string,
    password: string,
    role: UserRole,
    rememberMe?: boolean,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  unlockWithBiometric: () => boolean;
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setRememberMe: (remember: boolean) => void;
}

export type AuthStore = AuthState &
  AuthActions & {
    biometricSession: BiometricSession | null;
  };

/**
 * SecureStore protects native sessions, while the web build uses localStorage.
 * The guarded adapter also recovers to a signed-out state if storage is locked,
 * unavailable, or contains an unreadable value instead of hanging at startup.
 */
export const secureStorageAdapter: StateStorage = {
  async setItem(name, value) {
    try {
      await platformStorage.setItem(name, value);
    } catch (error) {
      console.warn('Unable to persist the HU session.', error);
    }
  },
  async getItem(name) {
    try {
      return await platformStorage.getItem(name);
    } catch (error) {
      console.warn('Unable to restore the HU session.', error);
      return null;
    }
  },
  async removeItem(name) {
    try {
      await platformStorage.removeItem(name);
    } catch (error) {
      console.warn('Unable to remove the HU session.', error);
    }
  },
};

const DEMO_PASSWORD = 'password123';
const DEMO_STUDENT_ID = 'HU-4982';
const DEMO_LECTURER_EMAIL = 'prof.abdi@hu.edu.so';

function matchesDemoAccount(identifier: string, password: string, role: UserRole) {
  if (password !== DEMO_PASSWORD) return false;

  if (role === 'student') {
    return identifier.toUpperCase() === DEMO_STUDENT_ID;
  }

  if (role === 'lecturer') {
    return identifier.toLowerCase() === DEMO_LECTURER_EMAIL;
  }

  return false;
}

function createBiometricSession(
  user: User | null,
  token: string | null,
  refreshToken: string | null,
): BiometricSession | null {
  if (!user || !token) return null;
  return { user, token, refreshToken };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isBiometricEnabled: false,
      rememberMe: true,
      biometricSession: null,

      login: async (identifier, password, role, rememberPreference) => {
        const cleanId = identifier.trim();

        if (!cleanId || !matchesDemoAccount(cleanId, password, role)) {
          return false;
        }

        // Keep a short, visible delay so the demo has honest loading feedback.
        await new Promise((resolve) => setTimeout(resolve, 450));

        const timestamp = Date.now();
        const mockJwt = `hu_demo_${role}_${timestamp}`;
        const mockRefresh = `hu_ref_${timestamp}_${Math.random().toString(36).slice(2, 9)}`;
        const activeUser: User = {
          ...MOCK_USER,
          role,
          studentId: role === 'student' ? cleanId.toUpperCase() : 'HU-FAC-108',
          fullName: role === 'student' ? 'Yonis Abdi' : 'Dr. Abdullahi Mohamud',
          email:
            role === 'student'
              ? `${cleanId.toLowerCase()}@students.hu.edu.so`
              : cleanId.toLowerCase(),
        };
        const rememberMe = rememberPreference ?? get().rememberMe;
        const biometricSession = get().isBiometricEnabled
          ? createBiometricSession(activeUser, mockJwt, mockRefresh)
          : get().biometricSession;

        set({
          user: activeUser,
          token: mockJwt,
          refreshToken: mockRefresh,
          isAuthenticated: true,
          rememberMe,
          biometricSession,
        });

        return true;
      },

      logout: async () => {
        // A biometric session is intentionally retained when the student opted
        // into quick login. Disabling quick login removes that snapshot.
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      unlockWithBiometric: () => {
        const { biometricSession, isBiometricEnabled } = get();
        if (!isBiometricEnabled || !biometricSession) return false;

        set({
          user: biometricSession.user,
          token: biometricSession.token,
          refreshToken: biometricSession.refreshToken,
          isAuthenticated: true,
        });
        return true;
      },

      setUser: (user) => {
        const state = get();
        set({
          user,
          biometricSession:
            state.isBiometricEnabled && state.token
              ? createBiometricSession(user, state.token, state.refreshToken)
              : state.biometricSession,
        });
      },

      setTokens: (token, refreshToken) => {
        const state = get();
        set({
          token,
          refreshToken,
          isAuthenticated: Boolean(token && state.user),
          biometricSession:
            state.isBiometricEnabled && state.user
              ? createBiometricSession(state.user, token, refreshToken)
              : state.biometricSession,
        });
      },

      setBiometricEnabled: (enabled) => {
        if (!enabled) {
          set({ isBiometricEnabled: false, biometricSession: null });
          return;
        }

        const state = get();
        const biometricSession = createBiometricSession(
          state.user,
          state.token,
          state.refreshToken,
        );

        // Quick login can only be enabled from an authenticated session.
        if (!state.isAuthenticated || !biometricSession) return;
        set({ isBiometricEnabled: true, biometricSession });
      },

      setRememberMe: (rememberMe) => set({ rememberMe }),
    }),
    {
      name: 'hu-auth-storage',
      version: 1,
      storage: createJSONStorage(() => secureStorageAdapter),
      migrate: (persistedState) => {
        const previous = (persistedState ?? {}) as Partial<AuthStore>;
        const shouldRestoreSession = previous.rememberMe === true;

        return {
          ...previous,
          user: shouldRestoreSession ? previous.user ?? null : null,
          token: shouldRestoreSession ? previous.token ?? null : null,
          refreshToken: shouldRestoreSession ? previous.refreshToken ?? null : null,
          isAuthenticated: shouldRestoreSession && previous.isAuthenticated === true,
          isBiometricEnabled: false,
          biometricSession: null,
          rememberMe: previous.rememberMe ?? true,
        } as AuthStore;
      },
      partialize: (state) => {
        const keepActiveSession = state.rememberMe && state.isAuthenticated;
        const keepBiometricSession = state.isBiometricEnabled && state.biometricSession;

        return {
          user: keepActiveSession ? state.user : null,
          token: keepActiveSession ? state.token : null,
          refreshToken: keepActiveSession ? state.refreshToken : null,
          isAuthenticated: keepActiveSession,
          isBiometricEnabled: Boolean(keepBiometricSession),
          rememberMe: state.rememberMe,
          biometricSession: keepBiometricSession || null,
        };
      },
    },
  ),
);

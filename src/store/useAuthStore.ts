import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { buildDemoUser, findDemoRole, verifyDemoPassword } from '../auth/roles';
import { platformStorage } from '../services/platformStorage';
import type { AuthState, User } from '../types';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30_000;
const REMEMBERED_SESSION_MS = 8 * 60 * 60 * 1000;
const TEMPORARY_SESSION_MS = 60 * 60 * 1000;

interface AttemptState {
  failures: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, AttemptState>();

interface BiometricSession {
  user: User;
  token: string;
  refreshToken: string | null;
  expiresAt: string;
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: 'invalid_credentials' | 'locked'; retryAfterSeconds?: number };

export interface AuthActions {
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<LoginResult>;
  logout: () => Promise<void>;
  expireSession: () => Promise<void>;
  isSessionValid: () => boolean;
  unlockWithBiometric: () => boolean;
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setRememberMe: (remember: boolean) => void;
}

export type AuthStore = AuthState & AuthActions & { biometricSession: BiometricSession | null };

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

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

function secondsUntil(timestamp: number) {
  return Math.max(1, Math.ceil((timestamp - Date.now()) / 1000));
}

function getActiveLock(identifier: string) {
  const attempt = loginAttempts.get(identifier);
  if (!attempt || attempt.lockedUntil <= Date.now()) return null;
  return attempt;
}

function recordFailedAttempt(identifier: string) {
  const current = loginAttempts.get(identifier);
  const failures = current?.lockedUntil && current.lockedUntil > Date.now()
    ? current.failures
    : (current?.failures ?? 0) + 1;
  const lockedUntil = failures >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : 0;
  const next = { failures: lockedUntil ? 0 : failures, lockedUntil };
  loginAttempts.set(identifier, next);
  return next;
}

function createBiometricSession(
  user: User | null,
  token: string | null,
  refreshToken: string | null,
  expiresAt: string | null,
): BiometricSession | null {
  if (!user || !token || !expiresAt) return null;
  return { user, token, refreshToken, expiresAt };
}

async function clearApiTokens() {
  await Promise.all([
    platformStorage.removeItem('hu_auth_token'),
    platformStorage.removeItem('hu_refresh_token'),
  ]).catch(() => undefined);
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
      sessionExpiresAt: null,
      lastAuthenticatedAt: null,
      biometricSession: null,

      login: async (identifier, password, rememberPreference) => {
        const normalizedIdentifier = normalizeIdentifier(identifier);
        const activeLock = getActiveLock(normalizedIdentifier);
        if (activeLock) {
          return { ok: false, reason: 'locked', retryAfterSeconds: secondsUntil(activeLock.lockedUntil) };
        }

        await new Promise((resolve) => setTimeout(resolve, 450));

        const role = findDemoRole(normalizedIdentifier);
        const validInput = normalizedIdentifier.includes('@') && password.length >= 10;
        if (!validInput || !role || !verifyDemoPassword(role, password)) {
          const attempt = recordFailedAttempt(normalizedIdentifier || 'anonymous');
          if (attempt.lockedUntil) {
            return { ok: false, reason: 'locked', retryAfterSeconds: secondsUntil(attempt.lockedUntil) };
          }
          return { ok: false, reason: 'invalid_credentials' };
        }

        loginAttempts.delete(normalizedIdentifier);
        const user = buildDemoUser(role);
        const rememberMe = rememberPreference ?? get().rememberMe;
        const authenticatedAt = new Date();
        const expiresAt = new Date(
          authenticatedAt.getTime() + (rememberMe ? REMEMBERED_SESSION_MS : TEMPORARY_SESSION_MS),
        );
        const token = `hu_demo_${Crypto.randomUUID()}`;
        const refreshToken = `hu_refresh_${Crypto.randomUUID()}`;
        const biometricSession = get().isBiometricEnabled
          ? createBiometricSession(user, token, refreshToken, expiresAt.toISOString())
          : null;

        if (rememberMe) {
          await Promise.all([
            platformStorage.setItem('hu_auth_token', token),
            platformStorage.setItem('hu_refresh_token', refreshToken),
          ]).catch(() => undefined);
        } else {
          await clearApiTokens();
        }

        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          rememberMe,
          sessionExpiresAt: expiresAt.toISOString(),
          lastAuthenticatedAt: authenticatedAt.toISOString(),
          biometricSession,
        });

        return { ok: true };
      },

      logout: async () => {
        await clearApiTokens();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          sessionExpiresAt: null,
          lastAuthenticatedAt: null,
          isBiometricEnabled: false,
          biometricSession: null,
        });
      },

      expireSession: async () => {
        await clearApiTokens();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          sessionExpiresAt: null,
          isBiometricEnabled: false,
          biometricSession: null,
        });
      },

      isSessionValid: () => {
        const state = get();
        if (!state.isAuthenticated || !state.token || !state.user || !state.sessionExpiresAt) return false;
        return new Date(state.sessionExpiresAt).getTime() > Date.now();
      },

      unlockWithBiometric: () => {
        const { biometricSession, isBiometricEnabled } = get();
        if (!isBiometricEnabled || !biometricSession) return false;
        if (new Date(biometricSession.expiresAt).getTime() <= Date.now()) {
          set({ isBiometricEnabled: false, biometricSession: null });
          return false;
        }

        const authenticatedAt = new Date();
        const expiresAt = new Date(authenticatedAt.getTime() + TEMPORARY_SESSION_MS);
        set({
          user: biometricSession.user,
          token: biometricSession.token,
          refreshToken: biometricSession.refreshToken,
          isAuthenticated: true,
          sessionExpiresAt: expiresAt.toISOString(),
          lastAuthenticatedAt: authenticatedAt.toISOString(),
        });
        return true;
      },

      setUser: (user) => {
        const state = get();
        set({
          user,
          biometricSession: state.isBiometricEnabled
            ? createBiometricSession(user, state.token, state.refreshToken, state.sessionExpiresAt)
            : state.biometricSession,
        });
      },

      setTokens: (token, refreshToken) => {
        const state = get();
        const expiresAt = new Date(Date.now() + TEMPORARY_SESSION_MS).toISOString();
        set({
          token,
          refreshToken,
          sessionExpiresAt: expiresAt,
          isAuthenticated: Boolean(token && state.user),
          biometricSession: state.isBiometricEnabled
            ? createBiometricSession(state.user, token, refreshToken, expiresAt)
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
          state.sessionExpiresAt,
        );
        if (!state.isAuthenticated || !biometricSession) return;
        set({ isBiometricEnabled: true, biometricSession });
      },

      setRememberMe: (rememberMe) => set({ rememberMe }),
    }),
    {
      name: 'hu-auth-storage',
      version: 2,
      storage: createJSONStorage(() => secureStorageAdapter),
      migrate: (persistedState) => {
        const previous = (persistedState ?? {}) as Partial<AuthStore>;
        const expiry = previous.sessionExpiresAt ? new Date(previous.sessionExpiresAt).getTime() : 0;
        const shouldRestoreSession =
          previous.rememberMe === true &&
          previous.isAuthenticated === true &&
          expiry > Date.now();

        return {
          ...previous,
          user: shouldRestoreSession ? previous.user ?? null : null,
          token: shouldRestoreSession ? previous.token ?? null : null,
          refreshToken: shouldRestoreSession ? previous.refreshToken ?? null : null,
          isAuthenticated: shouldRestoreSession,
          sessionExpiresAt: shouldRestoreSession ? previous.sessionExpiresAt ?? null : null,
          lastAuthenticatedAt: shouldRestoreSession ? previous.lastAuthenticatedAt ?? null : null,
          isBiometricEnabled: false,
          biometricSession: null,
          rememberMe: previous.rememberMe ?? true,
        } as AuthStore;
      },
      partialize: (state) => {
        const keepActiveSession = state.rememberMe && state.isSessionValid();
        const keepBiometricSession = state.isBiometricEnabled && state.biometricSession;
        return {
          user: keepActiveSession ? state.user : null,
          token: keepActiveSession ? state.token : null,
          refreshToken: keepActiveSession ? state.refreshToken : null,
          isAuthenticated: keepActiveSession,
          sessionExpiresAt: keepActiveSession ? state.sessionExpiresAt : null,
          lastAuthenticatedAt: keepActiveSession ? state.lastAuthenticatedAt : null,
          isBiometricEnabled: Boolean(keepBiometricSession),
          rememberMe: state.rememberMe,
          biometricSession: keepBiometricSession || null,
        };
      },
    },
  ),
);

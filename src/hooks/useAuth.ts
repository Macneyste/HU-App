import { isRunningInExpoGo } from 'expo';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';

interface BiometricInfo {
  isAvailable: boolean;
  isChecking: boolean;
  biometricType: string;
  unavailableReason: string | null;
}

const INITIAL_BIOMETRIC_INFO: BiometricInfo = {
  isAvailable: false,
  isChecking: true,
  biometricType: 'Biometrics',
  unavailableReason: null,
};

async function inspectBiometrics(): Promise<BiometricInfo> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return {
        isAvailable: false,
        isChecking: false,
        biometricType: 'Biometrics',
        unavailableReason: 'This device does not have supported biometric hardware.',
      };
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return {
        isAvailable: false,
        isChecking: false,
        biometricType: 'Biometrics',
        unavailableReason: 'Add a fingerprint or face unlock in your phone settings first.',
      };
    }

    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const face = LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION;
    const fingerprint = LocalAuthentication.AuthenticationType.FINGERPRINT;

    // Expo Go cannot present Apple's Face ID permission prompt. Touch ID remains
    // usable; Face ID is offered when the project runs as a development build.
    const usableTypes =
      Platform.OS === 'ios' && isRunningInExpoGo()
        ? supportedTypes.filter((type) => type !== face)
        : supportedTypes;

    if (usableTypes.length === 0) {
      return {
        isAvailable: false,
        isChecking: false,
        biometricType: 'Face ID',
        unavailableReason:
          Platform.OS === 'ios' && isRunningInExpoGo()
            ? 'Face ID requires an HU development build and is not available inside Expo Go.'
            : 'No enrolled biometric method is available.',
      };
    }

    const hasFace = usableTypes.includes(face);
    const hasFingerprint = usableTypes.includes(fingerprint);
    const biometricType =
      hasFace && hasFingerprint
        ? 'Biometrics'
        : hasFace
          ? Platform.OS === 'ios'
            ? 'Face ID'
            : 'Face unlock'
          : Platform.OS === 'ios'
            ? 'Touch ID'
            : 'Fingerprint';

    return {
      isAvailable: true,
      isChecking: false,
      biometricType,
      unavailableReason: null,
    };
  } catch {
    return {
      isAvailable: false,
      isChecking: false,
      biometricType: 'Biometrics',
      unavailableReason: 'Biometric availability could not be verified on this device.',
    };
  }
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBiometricEnabled = useAuthStore((state) => state.isBiometricEnabled);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const hasBiometricSession = useAuthStore((state) => Boolean(state.biometricSession));
  const storeLogin = useAuthStore((state) => state.login);
  const storeLogout = useAuthStore((state) => state.logout);
  const unlockWithBiometric = useAuthStore((state) => state.unlockWithBiometric);
  const updateBiometricPreference = useAuthStore((state) => state.setBiometricEnabled);
  const setRememberMe = useAuthStore((state) => state.setRememberMe);

  const [biometricInfo, setBiometricInfo] = useState<BiometricInfo>(INITIAL_BIOMETRIC_INFO);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async () => {
    await useAuthStore.persist.rehydrate();
  }, []);

  const refreshBiometricInfo = useCallback(async () => {
    const info = await inspectBiometrics();
    setBiometricInfo(info);
    return info;
  }, []);

  useEffect(() => {
    let isMounted = true;

    void inspectBiometrics().then((info) => {
      if (!isMounted) return;
      setBiometricInfo(info);

      // Remove stale preferences when the saved unlock material is incomplete
      // or the device can no longer authenticate with biometrics.
      if (isBiometricEnabled && (!hasBiometricSession || !info.isAvailable)) {
        updateBiometricPreference(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [hasBiometricSession, isBiometricEnabled, updateBiometricPreference]);

  const login = useCallback(
    async (identifier: string, password: string, role: UserRole, remember = rememberMe) => {
      setIsLoading(true);
      setError(null);

      try {
        const success = await storeLogin(identifier, password, role, remember);
        if (!success) {
          setError('Use the demo credentials shown below, then try again.');
        }
        return success;
      } catch {
        setError('Sign-in could not be completed. Please try again.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [rememberMe, storeLogin],
  );

  const setBiometricEnabled = useCallback(
    async (enabled: boolean) => {
      setError(null);

      if (!enabled) {
        updateBiometricPreference(false);
        return true;
      }

      if (!isAuthenticated) {
        setError('Sign in before enabling biometric quick login.');
        return false;
      }

      const info = await refreshBiometricInfo();
      if (!info.isAvailable) {
        setError(info.unavailableReason ?? 'Biometric quick login is unavailable.');
        updateBiometricPreference(false);
        return false;
      }

      updateBiometricPreference(true);
      return useAuthStore.getState().isBiometricEnabled;
    },
    [isAuthenticated, refreshBiometricInfo, updateBiometricPreference],
  );

  const authenticateWithBiometric = useCallback(async () => {
    setError(null);

    if (!isBiometricEnabled || !hasBiometricSession) {
      setError('Biometric quick login has not been enabled for this account.');
      return false;
    }

    const info = await refreshBiometricInfo();
    if (!info.isAvailable) {
      setError(info.unavailableReason ?? 'Biometric authentication is unavailable.');
      updateBiometricPreference(false);
      return false;
    }

    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock HU Campus Portal',
        promptSubtitle: 'Confirm your identity to continue',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
        fallbackLabel: '',
      });

      if (!result.success) {
        if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
          setError(
            result.error === 'lockout'
              ? 'Biometrics are temporarily locked. Unlock your phone and try again.'
              : 'Your identity could not be verified. Please use the demo password.',
          );
        }
        return false;
      }

      const unlocked = unlockWithBiometric();
      if (!unlocked) {
        setError('The saved quick-login session is no longer valid. Sign in with the demo password.');
      }
      return unlocked;
    } catch {
      setError('Biometric authentication could not be completed on this device.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    hasBiometricSession,
    isBiometricEnabled,
    refreshBiometricInfo,
    unlockWithBiometric,
    updateBiometricPreference,
  ]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await storeLogout();
    } finally {
      setIsLoading(false);
    }
  }, [storeLogout]);

  return {
    user,
    isAuthenticated,
    isBiometricEnabled,
    hasBiometricSession,
    rememberMe,
    isLoading,
    error,
    biometricInfo,
    login,
    logout,
    authenticateWithBiometric,
    hydrate,
    refreshBiometricInfo,
    setBiometricEnabled,
    setRememberMe,
    clearError: () => setError(null),
  };
}

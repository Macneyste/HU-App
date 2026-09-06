import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { colors, radii, shadows, typeStyles } from '../../theme';
import type { UserRole } from '../../types';

const DEMO_ACCOUNTS = {
  student: { identifier: 'HU-4982', password: 'password123' },
  lecturer: { identifier: 'prof.abdi@hu.edu.so', password: 'password123' },
} as const;

interface LoginFieldProps extends TextInputProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  right?: React.ReactNode;
}

function LoginField({ label, icon, error, right, onFocus, onBlur, ...props }: LoginFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[
          styles.fieldShell,
          focused && styles.fieldShellFocused,
          error ? styles.fieldShellError : null,
        ]}
      >
        <View pointerEvents="none" style={styles.fieldIcon}>
          {icon}
        </View>
        <TextInput
          {...props}
          accessibilityLabel={props.accessibilityLabel ?? label}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.textSoft}
          selectionColor={colors.emerald}
          style={styles.fieldInput}
        />
        {right}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.fieldError}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    authenticateWithBiometric,
    biometricInfo,
    clearError,
    error: authError,
    hasBiometricSession,
    isBiometricEnabled,
    isLoading,
    login,
    rememberMe,
    setRememberMe,
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Extract<UserRole, 'student' | 'lecturer'>>(
    'student',
  );
  const [identifier, setIdentifier] = useState<string>(DEMO_ACCOUNTS.student.identifier);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS.student.password);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const chooseRole = (role: Extract<UserRole, 'student' | 'lecturer'>) => {
    const account = DEMO_ACCOUNTS[role];
    setSelectedRole(role);
    setIdentifier(account.identifier);
    setPassword(account.password);
    setErrors({});
    clearError();
  };

  const useDemoCredentials = () => {
    const account = DEMO_ACCOUNTS[selectedRole];
    setIdentifier(account.identifier);
    setPassword(account.password);
    setErrors({});
    clearError();
  };

  const validate = () => {
    const nextErrors: { identifier?: string; password?: string } = {};
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      nextErrors.identifier =
        selectedRole === 'student' ? 'Enter the demo student ID.' : 'Enter the demo staff email.';
    } else if (selectedRole === 'lecturer' && !/^\S+@\S+\.\S+$/.test(cleanIdentifier)) {
      nextErrors.identifier = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Enter the demo password.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must contain at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (isLoading || !validate()) return;

    const success = await login(identifier, password, selectedRole, rememberMe);
    if (success) router.replace('/(drawer)/(tabs)');
  };

  const handleBiometricLogin = async () => {
    if (isLoading) return;
    const success = await authenticateWithBiometric();
    if (success) router.replace('/(drawer)/(tabs)');
  };

  const openLink = async (url: string, fallbackMessage: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', fallbackMessage);
    }
  };

  const emailSupport = () =>
    void openLink(
      'mailto:support@hu.edu.so?subject=HU%20Campus%20Portal%20access%20help',
      'Email support@hu.edu.so from your preferred mail app.',
    );

  const openPortal = () =>
    void openLink(
      'https://portal.hu.edu.so',
      'Open https://portal.hu.edu.so in your browser.',
    );

  const handleForgotPassword = () => {
    Alert.alert(
      'Account access help',
      'This preview uses demo credentials. For a real university account, contact the HU ICT support desk.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email ICT', onPress: emailSupport },
        { text: 'Open portal', onPress: openPortal },
      ],
    );
  };

  const canUseBiometricLogin =
    biometricInfo.isAvailable && isBiometricEnabled && hasBiometricSession;

  return (
    <LinearGradient
      colors={[colors.navyDark, colors.navy, colors.navyLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />
      <View pointerEvents="none" style={styles.backgroundGlowTop} />
      <View pointerEvents="none" style={styles.backgroundGlowBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 18, 38),
              paddingBottom: Math.max(insets.bottom + 22, 34),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <View style={styles.brandMark}>
              <BookOpenCheck size={29} color={colors.gold} strokeWidth={2.3} />
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandEyebrow}>HORMUUD UNIVERSITY</Text>
              <Text style={styles.brandTitle}>Campus Portal</Text>
              <Text style={styles.brandSubtitle}>Academic life, clearly organized.</Text>
            </View>
          </View>

          <View style={styles.loginCard}>
            <View style={styles.cardHeadingRow}>
              <View style={styles.cardHeadingCopy}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                <Text style={styles.welcomeSubtitle}>Choose your role and continue securely.</Text>
              </View>
              <View style={styles.secureBadge}>
                <ShieldCheck size={15} color={colors.emerald} />
                <Text style={styles.secureBadgeText}>SECURE</Text>
              </View>
            </View>

            <View accessibilityRole="tablist" style={styles.roleSelector}>
              <Pressable
                accessibilityLabel="Sign in as a student"
                accessibilityRole="tab"
                accessibilityState={{ selected: selectedRole === 'student' }}
                onPress={() => chooseRole('student')}
                style={({ pressed }) => [
                  styles.roleButton,
                  selectedRole === 'student' && styles.roleButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <GraduationCap
                  size={18}
                  color={selectedRole === 'student' ? '#FFFFFF' : colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === 'student' && styles.roleButtonTextSelected,
                  ]}
                >
                  Student
                </Text>
              </Pressable>

              <Pressable
                accessibilityLabel="Sign in as a lecturer"
                accessibilityRole="tab"
                accessibilityState={{ selected: selectedRole === 'lecturer' }}
                onPress={() => chooseRole('lecturer')}
                style={({ pressed }) => [
                  styles.roleButton,
                  selectedRole === 'lecturer' && styles.roleButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <BriefcaseBusiness
                  size={17}
                  color={selectedRole === 'lecturer' ? '#FFFFFF' : colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === 'lecturer' && styles.roleButtonTextSelected,
                  ]}
                >
                  Lecturer
                </Text>
              </Pressable>
            </View>

            <View style={styles.demoNotice}>
              <View style={styles.demoNoticeIcon}>
                <ShieldCheck size={16} color={colors.info} />
              </View>
              <View style={styles.demoNoticeCopy}>
                <Text style={styles.demoNoticeTitle}>Preview environment</Text>
                <Text style={styles.demoNoticeText}>
                  Sample campus data only. No request is sent to a live HU server.
                </Text>
              </View>
              <Pressable
                accessibilityLabel={`Fill ${selectedRole} demo credentials`}
                accessibilityRole="button"
                hitSlop={8}
                onPress={useDemoCredentials}
                style={({ pressed }) => [styles.demoFillButton, pressed && styles.pressed]}
              >
                <Text style={styles.demoFillText}>Fill demo</Text>
              </Pressable>
            </View>

            <LoginField
              autoCapitalize={selectedRole === 'student' ? 'characters' : 'none'}
              autoComplete="username"
              autoCorrect={false}
              error={errors.identifier}
              icon={<UserRound size={18} color={colors.navy} />}
              keyboardType={selectedRole === 'student' ? 'default' : 'email-address'}
              label={selectedRole === 'student' ? 'Student ID' : 'University email'}
              onChangeText={(value) => {
                setIdentifier(value);
                if (errors.identifier) setErrors((current) => ({ ...current, identifier: undefined }));
                clearError();
              }}
              placeholder={selectedRole === 'student' ? 'HU-4982' : 'name@hu.edu.so'}
              returnKeyType="next"
              value={identifier}
            />

            <LoginField
              autoCapitalize="none"
              autoComplete="current-password"
              error={errors.password}
              icon={<LockKeyhole size={18} color={colors.navy} />}
              label="Password"
              onChangeText={(value) => {
                setPassword(value);
                if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                clearError();
              }}
              onSubmitEditing={() => void handleLogin()}
              placeholder="Enter your password"
              returnKeyType="go"
              right={
                <Pressable
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  hitSlop={10}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  style={({ pressed }) => [styles.visibilityButton, pressed && styles.pressed]}
                >
                  {passwordVisible ? (
                    <EyeOff size={19} color={colors.textMuted} />
                  ) : (
                    <Eye size={19} color={colors.textMuted} />
                  )}
                </Pressable>
              }
              secureTextEntry={!passwordVisible}
              value={password}
            />

            <View style={styles.preferenceRow}>
              <Pressable
                accessibilityLabel="Remember me on this device"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                onPress={() => setRememberMe(!rememberMe)}
                style={({ pressed }) => [styles.rememberButton, pressed && styles.pressed]}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
                </View>
                <View>
                  <Text style={styles.rememberTitle}>Remember me</Text>
                  <Text style={styles.rememberCaption}>Keep this demo session signed in</Text>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={handleForgotPassword}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Text style={styles.forgotText}>Need help?</Text>
              </Pressable>
            </View>

            {authError ? (
              <View accessibilityLiveRegion="polite" style={styles.authErrorBox}>
                <Text style={styles.authErrorText}>{authError}</Text>
              </View>
            ) : null}

            <Pressable
              accessibilityLabel="Sign in to HU Campus Portal"
              accessibilityRole="button"
              accessibilityState={{ busy: isLoading, disabled: isLoading }}
              disabled={isLoading}
              onPress={() => void handleLogin()}
              style={({ pressed }) => [
                styles.signInButton,
                pressed && !isLoading && styles.signInButtonPressed,
                isLoading && styles.disabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.signInButtonText}>Sign in to portal</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            {canUseBiometricLogin ? (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerLabel}>OR</Text>
                  <View style={styles.divider} />
                </View>
                <Pressable
                  accessibilityLabel={`Sign in with ${biometricInfo.biometricType}`}
                  accessibilityRole="button"
                  disabled={isLoading}
                  onPress={() => void handleBiometricLogin()}
                  style={({ pressed }) => [
                    styles.biometricButton,
                    pressed && styles.biometricButtonPressed,
                    isLoading && styles.disabled,
                  ]}
                >
                  <Fingerprint size={20} color={colors.emerald} />
                  <Text style={styles.biometricButtonText}>
                    Continue with {biometricInfo.biometricType}
                  </Text>
                </Pressable>
              </>
            ) : null}

            <View style={styles.demoCredentials}>
              <Text style={styles.demoCredentialsLabel}>DEMO ACCESS</Text>
              <Text selectable style={styles.demoCredentialsText}>
                {selectedRole === 'student' ? 'HU-4982' : 'prof.abdi@hu.edu.so'} · password123
              </Text>
            </View>
          </View>

          <View style={styles.supportRow}>
            <Pressable
              accessibilityLabel="Email HU ICT support"
              accessibilityRole="link"
              onPress={emailSupport}
              style={({ pressed }) => [styles.supportLink, pressed && styles.supportLinkPressed]}
            >
              <Mail size={14} color="rgba(255,255,255,0.82)" />
              <Text style={styles.supportLinkText}>support@hu.edu.so</Text>
            </Pressable>
            <View style={styles.supportDot} />
            <Pressable
              accessibilityLabel="Open the HU web portal"
              accessibilityRole="link"
              onPress={openPortal}
              style={({ pressed }) => [styles.supportLink, pressed && styles.supportLinkPressed]}
            >
              <Text style={styles.supportLinkText}>portal.hu.edu.so</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  backgroundGlowTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    right: -110,
    top: -95,
    backgroundColor: 'rgba(244,183,64,0.11)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    width: 310,
    height: 310,
    borderRadius: 155,
    left: -180,
    bottom: -185,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  brandBlock: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    paddingHorizontal: 3,
  },
  brandMark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.17)',
    marginRight: 14,
  },
  brandCopy: { flex: 1 },
  brandEyebrow: {
    ...typeStyles.eyebrow,
    color: colors.gold,
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  brandSubtitle: {
    ...typeStyles.caption,
    color: 'rgba(255,255,255,0.66)',
    marginTop: 2,
  },
  loginCard: {
    width: '100%',
    maxWidth: 520,
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    ...shadows.floating,
  },
  cardHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  cardHeadingCopy: { flex: 1, paddingRight: 12 },
  welcomeTitle: { ...typeStyles.title, color: colors.text },
  welcomeSubtitle: { ...typeStyles.body, color: colors.textMuted, marginTop: 3 },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#E9F8F2',
  },
  secureBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7, color: colors.emerald },
  roleSelector: {
    flexDirection: 'row',
    gap: 6,
    padding: 5,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  roleButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: radii.md,
  },
  roleButtonSelected: { backgroundColor: colors.navy },
  roleButtonText: { fontSize: 13, fontWeight: '800', color: colors.textMuted },
  roleButtonTextSelected: { color: '#FFFFFF' },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderRadius: radii.md,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#CFE8F8',
    marginBottom: 17,
  },
  demoNoticeIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 9,
  },
  demoNoticeCopy: { flex: 1, paddingRight: 6 },
  demoNoticeTitle: { fontSize: 11, fontWeight: '900', color: colors.info },
  demoNoticeText: { fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: colors.textMuted, marginTop: 1 },
  demoFillButton: { minHeight: 36, justifyContent: 'center', paddingHorizontal: 7 },
  demoFillText: { fontSize: 11, fontWeight: '900', color: colors.navy },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: colors.text, marginBottom: 7 },
  fieldShell: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.25,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
  },
  fieldShellFocused: {
    borderColor: colors.emerald,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 1,
  },
  fieldShellError: { borderColor: '#FCA5A5', backgroundColor: '#FFF9F9' },
  fieldIcon: { width: 45, alignItems: 'center', justifyContent: 'center' },
  fieldInput: {
    flex: 1,
    minHeight: 50,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  visibilityButton: {
    width: 45,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldError: { fontSize: 11, lineHeight: 15, fontWeight: '600', color: colors.danger, marginTop: 5, marginLeft: 3 },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  rememberButton: { flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 21,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#B7C3D0',
    backgroundColor: '#FFFFFF',
    marginRight: 9,
  },
  checkboxChecked: { borderColor: colors.emerald, backgroundColor: colors.emerald },
  rememberTitle: { fontSize: 12, fontWeight: '800', color: colors.text },
  rememberCaption: { fontSize: 9.5, fontWeight: '500', color: colors.textMuted, marginTop: 1 },
  forgotText: { fontSize: 12, fontWeight: '800', color: colors.emerald },
  authErrorBox: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.sm,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  authErrorText: { fontSize: 11.5, lineHeight: 16, fontWeight: '600', color: colors.danger },
  signInButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: radii.md,
    backgroundColor: colors.emerald,
    shadowColor: colors.emeraldDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  signInButtonPressed: { backgroundColor: colors.emeraldDark, transform: [{ scale: 0.992 }] },
  signInButtonText: { fontSize: 15, fontWeight: '900', letterSpacing: 0.15, color: '#FFFFFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabel: { fontSize: 9, fontWeight: '900', color: colors.textSoft },
  biometricButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1.25,
    borderColor: '#B9DFD1',
    borderRadius: radii.md,
    backgroundColor: '#F3FBF8',
  },
  biometricButtonPressed: { backgroundColor: '#E8F7F1' },
  biometricButtonText: { fontSize: 13, fontWeight: '800', color: colors.emeraldDark },
  demoCredentials: {
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoCredentialsLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: colors.textSoft },
  demoCredentialsText: { fontSize: 11.5, fontWeight: '700', color: colors.textMuted, marginTop: 3 },
  supportRow: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  supportLink: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 7 },
  supportLinkPressed: { opacity: 0.55 },
  supportLinkText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.82)' },
  supportDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.28)' },
  pressed: { opacity: 0.62 },
  disabled: { opacity: 0.58 },
});

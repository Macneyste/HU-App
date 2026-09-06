import { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  AtSign,
  Check,
  ChevronDown,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DEMO_ROLE_ORDER, getRoleDefinition } from '../../auth/roles';
import { HORMUUD_UNIVERSITY, HU_ASSETS } from '../../data/university';
import { useAuth } from '../../hooks/useAuth';
import { colors, radii, shadows, typeStyles } from '../../theme';
import type { UserRole } from '../../types';

export default function LoginScreen() {
  const router = useRouter();
  const {
    authenticateWithBiometric,
    biometricInfo,
    clearError,
    error,
    hasBiometricSession,
    isBiometricEnabled,
    isLoading,
    login,
    rememberMe,
    setRememberMe,
  } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const selectedDefinition = useMemo(() => getRoleDefinition(selectedRole), [selectedRole]);

  const useDemoCredentials = (role = selectedRole) => {
    const definition = getRoleDefinition(role);
    setSelectedRole(role);
    setEmail(definition.demoEmail);
    setPassword(definition.demoPassword);
    setEmailError(null);
    setPasswordError(null);
    clearError();
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    const validPassword = password.length >= 10;
    setEmailError(validEmail ? null : 'Enter a valid account email.');
    setPasswordError(validPassword ? null : 'Password must contain at least 10 characters.');
    clearError();
    if (!validEmail || !validPassword) return;

    const authenticated = await login(normalizedEmail, password, rememberMe);
    if (authenticated) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      router.replace('/(drawer)/(tabs)');
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  };

  const handleBiometricLogin = async () => {
    const authenticated = await authenticateWithBiometric();
    if (authenticated) router.replace('/(drawer)/(tabs)');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ImageBackground source={HU_ASSETS.campus} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroOverlay} />
            <View style={styles.brandRow}>
              <View style={styles.logoShell}>
                <Image source={HU_ASSETS.logo} resizeMode="contain" style={styles.logo} />
              </View>
              <View style={styles.brandCopy}>
                <Text style={styles.brandName}>{HORMUUD_UNIVERSITY.name}</Text>
                <Text style={styles.brandTagline}>{HORMUUD_UNIVERSITY.tagline}</Text>
              </View>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.kicker}>SECURE CAMPUS PORTAL</Text>
              <Text style={styles.heroTitle}>One university. Your role. The right access.</Text>
              <Text style={styles.heroSubtitle}>
                Academic and administrative services, protected by role-based access.
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.formSection}>
            <View style={styles.formHeading}>
              <Text style={styles.formTitle}>Sign in to HU</Text>
              <Text style={styles.formSubtitle}>Choose a demo role, then use its portal credentials.</Text>
            </View>

            <Text style={styles.fieldLabel}>Portal role</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Selected role: ${selectedDefinition.label}`}
              onPress={() => setRoleModalVisible(true)}
              style={({ pressed }) => [styles.roleSelector, pressed && styles.pressed]}
            >
              <View style={styles.roleIcon}>
                <UsersRound size={21} color={colors.primary} />
              </View>
              <View style={styles.roleCopy}>
                <Text style={styles.roleLabel}>{selectedDefinition.label}</Text>
                <Text style={styles.roleDepartment} numberOfLines={1}>{selectedDefinition.department}</Text>
              </View>
              <ChevronDown size={20} color={colors.textMuted} />
            </Pressable>

            <View style={styles.demoCard}>
              <View style={styles.demoHeader}>
                <View style={styles.demoBadge}>
                  <ShieldCheck size={14} color={colors.primaryDark} />
                  <Text style={styles.demoBadgeText}>DEMO ONLY</Text>
                </View>
                <Pressable onPress={() => useDemoCredentials()} style={styles.fillButton}>
                  <Text style={styles.fillButtonText}>Use credentials</Text>
                </Pressable>
              </View>
              <Text style={styles.credentialLine}>{selectedDefinition.demoEmail}</Text>
              <Text style={styles.credentialLine}>{selectedDefinition.demoPassword}</Text>
              <Text style={styles.demoNote}>These credentials do not represent a real HU account.</Text>
            </View>

            <Input
              label="Email address"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError(null);
                clearError();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              placeholder="name@demo.hu.edu.so"
              error={emailError ?? undefined}
              leftIcon={<AtSign size={19} color={colors.textMuted} />}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setPasswordError(null);
                clearError();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              placeholder="Enter your password"
              error={passwordError ?? undefined}
              isPassword
              leftIcon={<LockKeyhole size={19} color={colors.textMuted} />}
              onSubmitEditing={() => void handleLogin()}
            />

            {error ? (
              <View accessibilityRole="alert" style={styles.errorBanner}>
                <LockKeyhole size={17} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberRow}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe ? <Check size={15} color="#FFFFFF" strokeWidth={3} /> : null}
              </View>
              <View style={styles.rememberCopy}>
                <Text style={styles.rememberTitle}>Remember this device</Text>
                <Text style={styles.rememberHint}>Session expires automatically after 8 hours.</Text>
              </View>
            </Pressable>

            <Button title="Secure sign in" onPress={handleLogin} loading={isLoading} fullWidth size="lg" />

            {isBiometricEnabled && hasBiometricSession && biometricInfo.isAvailable ? (
              <Button
                title={`Continue with ${biometricInfo.biometricType}`}
                onPress={handleBiometricLogin}
                disabled={isLoading}
                variant="outline"
                fullWidth
                icon={<Fingerprint size={20} color={colors.primary} />}
                style={styles.biometricButton}
              />
            ) : null}

            <View style={styles.securityNotice}>
              <ShieldCheck size={18} color={colors.secondary} />
              <Text style={styles.securityText}>
                Five failed attempts trigger a temporary lock. Roles are assigned by the account—not by this selector.
              </Text>
            </View>

            <Text style={styles.footerText}>
              {HORMUUD_UNIVERSITY.address} · {HORMUUD_UNIVERSITY.phone}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent
        visible={roleModalVisible}
        onRequestClose={() => setRoleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose a portal role</Text>
                <Text style={styles.modalSubtitle}>13 permission profiles are available in this demo.</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close role selector"
                onPress={() => setRoleModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.roleList}>
              {DEMO_ROLE_ORDER.map((role) => {
                const definition = getRoleDefinition(role);
                const selected = role === selectedRole;
                return (
                  <Pressable
                    key={role}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      useDemoCredentials(role);
                      setRoleModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.roleOption,
                      selected && styles.roleOptionSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={[styles.optionIndex, selected && styles.optionIndexSelected]}>
                      <Text style={[styles.optionIndexText, selected && styles.optionIndexTextSelected]}>
                        {String(DEMO_ROLE_ORDER.indexOf(role) + 1).padStart(2, '0')}
                      </Text>
                    </View>
                    <View style={styles.roleCopy}>
                      <Text style={styles.roleLabel}>{definition.label}</Text>
                      <Text style={styles.roleDepartment} numberOfLines={1}>{definition.demoEmail}</Text>
                    </View>
                    {selected ? <Check size={19} color={colors.primary} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  hero: { minHeight: 330, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 32 },
  heroImage: { resizeMode: 'cover' },
  heroOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(8, 42, 27, 0.76)' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoShell: { width: 62, height: 72, borderRadius: 14, backgroundColor: '#FFFFFF', padding: 5, ...shadows.card },
  logo: { width: '100%', height: '100%' },
  brandCopy: { flex: 1, marginLeft: 13 },
  brandName: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
  brandTagline: { color: 'rgba(255,255,255,0.78)', fontSize: 12, fontWeight: '600', marginTop: 3 },
  heroCopy: { maxWidth: 420 },
  kicker: { ...typeStyles.eyebrow, color: '#86D5B2', marginBottom: 9 },
  heroTitle: { color: '#FFFFFF', fontSize: 34, lineHeight: 38, fontWeight: '800', letterSpacing: -1 },
  heroSubtitle: { color: 'rgba(255,255,255,0.76)', fontSize: 14, lineHeight: 20, marginTop: 10 },
  formSection: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 38 },
  formHeading: { marginBottom: 22 },
  formTitle: { color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  formSubtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 5 },
  fieldLabel: { ...typeStyles.caption, color: colors.text, fontWeight: '700', marginBottom: 7 },
  roleSelector: { minHeight: 62, flexDirection: 'row', alignItems: 'center', borderWidth: 1.25, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surface, paddingHorizontal: 13, marginBottom: 12 },
  roleIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  roleCopy: { flex: 1, minWidth: 0 },
  roleLabel: { color: colors.text, fontSize: 14, fontWeight: '800' },
  roleDepartment: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  demoCard: { borderRadius: radii.md, borderWidth: 1, borderColor: '#BFDCCF', backgroundColor: colors.primarySoft, padding: 13, marginBottom: 20 },
  demoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  demoBadgeText: { color: colors.primaryDark, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  fillButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#FFFFFF' },
  fillButtonText: { color: colors.primaryDark, fontSize: 11, fontWeight: '800' },
  credentialLine: { color: colors.text, fontSize: 12, fontWeight: '700', fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) },
  demoNote: { color: colors.textMuted, fontSize: 10, lineHeight: 14, marginTop: 7 },
  errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 12, borderRadius: radii.md, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', marginBottom: 14 },
  errorText: { flex: 1, color: colors.danger, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  rememberCopy: { flex: 1 },
  rememberTitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
  rememberHint: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  biometricButton: { marginTop: 10 },
  securityNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 13, marginTop: 18, borderRadius: radii.md, backgroundColor: colors.secondarySoft },
  securityText: { flex: 1, color: colors.textMuted, fontSize: 11, lineHeight: 16 },
  footerText: { color: colors.textSoft, fontSize: 10, textAlign: 'center', marginTop: 24 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(14,21,17,0.54)' },
  modalSheet: { maxHeight: '82%', backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 10, paddingHorizontal: 18, paddingBottom: 26 },
  modalHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  modalSubtitle: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  closeButton: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted },
  roleList: { paddingBottom: 20 },
  roleOption: { minHeight: 62, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, marginBottom: 8 },
  roleOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionIndex: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted, marginRight: 11 },
  optionIndexSelected: { backgroundColor: colors.primary },
  optionIndexText: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  optionIndexTextSelected: { color: '#FFFFFF' },
  pressed: { opacity: 0.72 },
});

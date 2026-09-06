import React, { useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Fingerprint,
  GraduationCap,
  IdCard,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthStore } from '../../../store/useAuthStore';
import { MOCK_USER } from '../../../data/mockData';
import { AppHeader } from '../../../components/ui/AppHeader';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { colors, radii, typeStyles } from '../../../theme';

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  last?: boolean;
}

function DetailRow({ icon: Icon, label, value, last = false }: DetailRowProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.detailRow, !last && styles.detailDivider]}
    >
      <View style={styles.detailIcon}>
        <Icon size={18} color={colors.navy} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} selectable>
          {value}
        </Text>
      </View>
    </View>
  );
}

interface ServiceCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
  title: string;
  description: string;
  accessibilityLabel: string;
  onPress: () => void;
}

function ServiceCard({
  icon: Icon,
  iconColor,
  iconBackground,
  title,
  description,
  accessibilityLabel,
  onPress,
}: ServiceCardProps) {
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={styles.serviceCard}
      padding={15}
    >
      <View style={styles.serviceRow}>
        <View style={[styles.serviceIcon, { backgroundColor: iconBackground }]}>
          <Icon size={21} color={iconColor} />
        </View>
        <View style={styles.serviceCopy}>
          <Text style={styles.serviceTitle}>{title}</Text>
          <Text style={styles.serviceDescription}>{description}</Text>
        </View>
        <ChevronRight size={19} color={colors.textMuted} />
      </View>
    </Card>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user) ?? MOCK_USER;
  const {
    biometricInfo,
    isBiometricEnabled,
    logout,
    refreshBiometricInfo,
    setBiometricEnabled,
  } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isUpdatingBiometrics, setIsUpdatingBiometrics] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = useMemo(
    () =>
      user.fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join(''),
    [user.fullName],
  );

  const enrollmentDate = useMemo(() => {
    const parsed = new Date(`${user.enrollmentDate}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return user.enrollmentDate;
    return parsed.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [user.enrollmentDate]);

  const roleLabel = `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`;
  const biometricName = biometricInfo.biometricType || 'Biometrics';
  const biometricStatus = biometricInfo.isChecking
    ? 'Checking whether this device supports secure biometric unlock…'
    : isBiometricEnabled
      ? `${biometricName} quick login is enabled on this device.`
      : biometricInfo.isAvailable
        ? `${biometricName} is available but currently turned off.`
        : biometricInfo.unavailableReason ?? 'Biometric quick login is unavailable on this device.';

  const handleBiometricChange = async (enabled: boolean) => {
    if (isUpdatingBiometrics) return;

    setIsUpdatingBiometrics(true);
    try {
      const updated = await setBiometricEnabled(enabled);

      if (enabled && !updated) {
        const latestInfo = await refreshBiometricInfo();
        Alert.alert(
          'Biometric quick login unavailable',
          latestInfo.unavailableReason ??
            'Quick login could not be enabled. Confirm that your phone has an enrolled fingerprint or face unlock, then try again.',
          [{ text: 'OK' }],
        );
        AccessibilityInfo.announceForAccessibility('Biometric quick login was not enabled.');
        return;
      }

      AccessibilityInfo.announceForAccessibility(
        enabled ? 'Biometric quick login enabled.' : 'Biometric quick login disabled.',
      );
    } catch {
      Alert.alert(
        'Unable to update security setting',
        'The biometric preference could not be changed. Please try again.',
        [{ text: 'OK' }],
      );
      AccessibilityInfo.announceForAccessibility('The biometric setting could not be updated.');
    } finally {
      setIsUpdatingBiometrics(false);
    }
  };

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('Unable to sign out', 'Your session could not be closed. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign out of HU Portal?',
      'You will need your student ID or university email to sign in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            void signOut();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />

      <AppHeader
        eyebrow="Account"
        title="Profile & access"
        subtitle="Your university identity, services, and security preferences."
      >
        <View
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${user.fullName}, ${roleLabel}, account ${user.studentId}, ${user.program}`}
          style={styles.identityCard}
        >
          <View style={styles.avatarFrame}>
            {!avatarFailed && user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                resizeMode="cover"
                onError={() => setAvatarFailed(true)}
                style={styles.avatar}
              />
            ) : (
              <Text style={styles.avatarInitials}>{initials || 'HU'}</Text>
            )}
          </View>

          <View style={styles.identityCopy}>
            <Text style={styles.identityName}>{user.fullName}</Text>
            <Text style={styles.identityProgram}>{user.program}</Text>
            <View style={styles.identityMetaRow}>
              <View style={styles.idPill}>
                <Text style={styles.idPillText}>{user.studentId}</Text>
              </View>
              <View style={styles.rolePill}>
                <View style={styles.activeDot} />
                <Text style={styles.rolePillText}>{roleLabel}</Text>
              </View>
            </View>
          </View>
        </View>
      </AppHeader>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 28 },
        ]}
      >
        <View style={styles.section}>
          <SectionHeader
            title="Academic record"
            subtitle="Details held for your current university account"
          />
          <Card padding={0}>
            <DetailRow icon={GraduationCap} label="Degree program" value={user.program} />
            <DetailRow icon={Building2} label="Faculty" value={user.faculty} />
            <DetailRow
              icon={CalendarDays}
              label="Year and semester"
              value={`Year ${user.yearOfStudy} · Semester ${user.semester}`}
            />
            <DetailRow icon={CalendarDays} label="Enrollment date" value={enrollmentDate} />
            <DetailRow icon={Mail} label="Institutional email" value={user.email} />
            <DetailRow icon={Phone} label="Registered contact" value={user.phone} last />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Campus services" subtitle="Identity and learning resources" />
          <ServiceCard
            icon={IdCard}
            iconColor={colors.navy}
            iconBackground="#E8EEF5"
            title="Digital student ID"
            description="View your photo credential and QR gate pass"
            accessibilityLabel="Open digital student ID and QR gate pass"
            onPress={() => router.push('/(drawer)/id-card')}
          />
          <ServiceCard
            icon={BookOpen}
            iconColor={colors.emerald}
            iconBackground="#E8F5EF"
            title="E-Library"
            description="Browse textbooks, journals, and research resources"
            accessibilityLabel="Open the university e-library"
            onPress={() => router.push('/(drawer)/library')}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Security & access" subtitle="Control sign-in on this device" />
          <Card>
            <View style={styles.securityRow}>
              <View style={styles.securityIcon}>
                <Fingerprint size={22} color={colors.warning} />
              </View>
              <View style={styles.securityCopy}>
                <Text style={styles.securityTitle}>{biometricName} quick login</Text>
                <Text
                  style={[
                    styles.securityStatus,
                    isBiometricEnabled && styles.securityStatusEnabled,
                  ]}
                >
                  {biometricStatus}
                </Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                disabled={isUpdatingBiometrics || biometricInfo.isChecking}
                onValueChange={(enabled) => {
                  void handleBiometricChange(enabled);
                }}
                trackColor={{ false: '#CBD5E1', true: colors.emerald }}
                thumbColor="#FFFFFF"
                accessibilityRole="switch"
                accessibilityLabel={`${biometricName} quick login`}
                accessibilityHint="Enables or disables biometric quick login on this device"
                accessibilityState={{
                  checked: isBiometricEnabled,
                  disabled: isUpdatingBiometrics || biometricInfo.isChecking,
                  busy: isUpdatingBiometrics || biometricInfo.isChecking,
                }}
              />
            </View>

            <View style={styles.privacyNote} accessible accessibilityRole="text">
              <ShieldCheck size={16} color={colors.emeraldDark} />
              <Text style={styles.privacyText}>
                Your phone verifies your fingerprint or face. HU Portal does not receive or store
                biometric images.
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.signOutSection}>
          <Button
            title="Sign out of HU Portal"
            onPress={handleLogout}
            icon={<LogOut size={18} color={colors.danger} />}
            variant="danger"
            size="lg"
            fullWidth
            loading={isSigningOut}
            accessibilityLabel="Sign out of HU Portal"
            accessibilityHint="Asks for confirmation before ending your session"
          />
          <Text style={styles.signOutHint}>Only this device's signed-in session will be closed.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  identityCard: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.lg,
  },
  avatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDE7F0',
    borderWidth: 2,
    borderColor: colors.gold,
    marginRight: 13,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  identityName: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
  },
  identityProgram: {
    ...typeStyles.caption,
    color: 'rgba(255,255,255,0.76)',
    marginTop: 2,
  },
  identityMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    marginTop: 9,
  },
  idPill: {
    minHeight: 26,
    justifyContent: 'center',
    paddingHorizontal: 9,
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
  },
  idPillText: {
    color: colors.navyDark,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  rolePill: {
    minHeight: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(8,127,91,0.35)',
    borderRadius: radii.pill,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63E6BE',
  },
  rolePillText: {
    color: '#E0FFF4',
    fontSize: 11,
    fontWeight: '800',
  },
  section: {
    marginBottom: 24,
  },
  detailRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  detailDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  detailCopy: {
    flex: 1,
    minWidth: 0,
    paddingTop: 1,
  },
  detailLabel: {
    ...typeStyles.caption,
    color: colors.textMuted,
  },
  detailValue: {
    ...typeStyles.body,
    color: colors.text,
    fontWeight: '800',
    marginTop: 3,
  },
  serviceCard: {
    marginBottom: 10,
  },
  serviceRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  serviceTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  serviceDescription: {
    ...typeStyles.caption,
    color: colors.textMuted,
    marginTop: 3,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#F5D99E',
    marginRight: 12,
  },
  securityCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  securityTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  securityStatus: {
    ...typeStyles.caption,
    color: colors.textMuted,
    marginTop: 3,
  },
  securityStatusEnabled: {
    color: colors.emeraldDark,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  privacyText: {
    flex: 1,
    ...typeStyles.caption,
    color: colors.textMuted,
  },
  signOutSection: {
    marginBottom: 8,
  },
  signOutHint: {
    ...typeStyles.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 9,
  },
});

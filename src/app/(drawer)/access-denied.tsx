import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LockKeyhole, ShieldCheck } from 'lucide-react-native';
import { getRoleDefinition, PORTAL_MODULES } from '../../auth/roles';
import { AppHeader } from '../../components/ui/AppHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import { colors, radii, typeStyles } from '../../theme';
import type { PortalModule } from '../../types';

export default function AccessDeniedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ module?: string }>();
  const user = useAuthStore((state) => state.user);
  const role = user ? getRoleDefinition(user.role) : null;
  const moduleDefinition = useMemo(
    () => PORTAL_MODULES.find((item) => item.id === params.module),
    [params.module],
  );

  return (
    <View style={styles.screen}>
      <AppHeader eyebrow="Security policy" title="Access restricted" subtitle="HU role-based access control" />
      <View style={styles.content}>
        <Card shadow="md" padding={22} style={styles.card}>
          <View style={styles.iconShell}>
            <LockKeyhole size={34} color={colors.danger} />
          </View>
          <Text style={styles.title}>{moduleDefinition?.label ?? 'This module'} is not available</Text>
          <Text style={styles.message}>
            Your {role?.label ?? 'current'} account does not have permission to open this area. Direct links are protected by the same policy as visible navigation.
          </Text>
          <View style={styles.rolePill}>
            <ShieldCheck size={16} color={colors.primaryDark} />
            <Text style={styles.roleText}>Signed in as {role?.label ?? 'unknown role'}</Text>
          </View>
          <Button
            title="Return to dashboard"
            onPress={() => router.replace('/(drawer)/(tabs)')}
            fullWidth
            style={styles.button}
          />
          <Button
            title="Review my access"
            onPress={() => router.replace('/(drawer)/access')}
            variant="outline"
            fullWidth
            style={styles.secondaryButton}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { maxWidth: 520, width: '100%', alignSelf: 'center', alignItems: 'center' },
  iconShell: { width: 74, height: 74, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', marginBottom: 18 },
  title: { color: colors.text, fontSize: 21, fontWeight: '800', textAlign: 'center' },
  message: { ...typeStyles.body, color: colors.textMuted, textAlign: 'center', marginTop: 9 },
  rolePill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.primarySoft, borderRadius: radii.pill, paddingHorizontal: 13, paddingVertical: 8, marginTop: 18 },
  roleText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' },
  button: { marginTop: 24 },
  secondaryButton: { marginTop: 9 },
});

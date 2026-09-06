import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Eye, LockKeyhole, Settings2, ShieldCheck } from 'lucide-react-native';
import { getModuleAccess, getRoleDefinition, PORTAL_MODULES } from '../../auth/roles';
import { AppHeader } from '../../components/ui/AppHeader';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import { colors, radii, typeStyles } from '../../theme';

export default function AccessCenterScreen() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  const definition = getRoleDefinition(user.role);
  const allowed = PORTAL_MODULES.filter((module) => getModuleAccess(user.role, module.id));
  const restricted = PORTAL_MODULES.filter((module) => !getModuleAccess(user.role, module.id));

  return (
    <View style={styles.screen}>
      <AppHeader
        eyebrow="Role-based access"
        title="My access center"
        subtitle={`${definition.label} · ${definition.department}`}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryValue}>{allowed.length}</Text>
            <Text style={styles.summaryLabel}>Available modules</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryValue}>{restricted.length}</Text>
            <Text style={styles.summaryLabel}>Restricted modules</Text>
          </View>
        </View>
      </AppHeader>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Card padding={16} style={styles.policyCard}>
          <View style={styles.policyIcon}>
            <ShieldCheck size={23} color={colors.primary} />
          </View>
          <View style={styles.policyCopy}>
            <Text style={styles.policyTitle}>{definition.label}</Text>
            <Text style={styles.policyText}>{definition.description}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Available to your role</Text>
        <Text style={styles.sectionSubtitle}>Manage includes permission to view the same module.</Text>
        {allowed.map((module) => {
          const level = getModuleAccess(user.role, module.id);
          const managed = level === 'manage';
          return (
            <Card key={module.id} padding={14} style={styles.moduleCard}>
              <View style={[styles.moduleIcon, managed ? styles.manageIcon : styles.viewIcon]}>
                {managed
                  ? <Settings2 size={19} color={colors.primaryDark} />
                  : <Eye size={19} color={colors.secondaryDark} />}
              </View>
              <View style={styles.moduleCopy}>
                <Text style={styles.moduleTitle}>{module.label}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </View>
              <View style={[styles.accessBadge, managed ? styles.manageBadge : styles.viewBadge]}>
                <CheckCircle2 size={12} color={managed ? colors.primaryDark : colors.secondaryDark} />
                <Text style={[styles.accessBadgeText, { color: managed ? colors.primaryDark : colors.secondaryDark }]}>
                  {managed ? 'MANAGE' : 'VIEW'}
                </Text>
              </View>
            </Card>
          );
        })}

        {restricted.length ? (
          <>
            <Text style={[styles.sectionTitle, styles.restrictedHeading]}>Restricted for your role</Text>
            <Text style={styles.sectionSubtitle}>These modules remain protected even when opened by a direct link.</Text>
            {restricted.map((module) => (
              <View key={module.id} style={styles.restrictedRow}>
                <View style={styles.restrictedIcon}>
                  <LockKeyhole size={16} color={colors.textSoft} />
                </View>
                <View style={styles.moduleCopy}>
                  <Text style={styles.restrictedTitle}>{module.label}</Text>
                  <Text style={styles.restrictedText}>{module.description}</Text>
                </View>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 38 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', borderRadius: radii.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.09)', paddingVertical: 12 },
  summaryBlock: { flex: 1, alignItems: 'center' },
  summaryValue: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', marginTop: 2 },
  summaryDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.2)' },
  policyCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  policyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  policyCopy: { flex: 1 },
  policyTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  policyText: { ...typeStyles.caption, color: colors.textMuted, marginTop: 3 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { ...typeStyles.caption, color: colors.textMuted, marginTop: 3, marginBottom: 13 },
  moduleCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  moduleIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  manageIcon: { backgroundColor: colors.primarySoft },
  viewIcon: { backgroundColor: colors.secondarySoft },
  moduleCopy: { flex: 1, minWidth: 0, paddingRight: 8 },
  moduleTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  moduleDescription: { color: colors.textMuted, fontSize: 10, lineHeight: 14, marginTop: 2 },
  accessBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 6 },
  manageBadge: { backgroundColor: colors.primarySoft },
  viewBadge: { backgroundColor: colors.secondarySoft },
  accessBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  restrictedHeading: { marginTop: 22 },
  restrictedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  restrictedIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted, marginRight: 11 },
  restrictedTitle: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  restrictedText: { color: colors.textSoft, fontSize: 10, lineHeight: 14, marginTop: 2 },
});

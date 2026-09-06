import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Award, Bell, BookCheck, CalendarDays, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  MOCK_ACTION_ITEMS,
  MOCK_ANNOUNCEMENTS,
  MOCK_COURSES,
  MOCK_DASHBOARD_STATS,
  MOCK_USER,
  getNextClassInfo,
} from '../../../data/mockData';
import { ActionGrid } from '../../../components/modules/ActionGrid';
import { AttendanceRing } from '../../../components/modules/AttendanceRing';
import { NextClassWidget } from '../../../components/modules/NextClassWidget';
import { AppHeader } from '../../../components/ui/AppHeader';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { StatCard } from '../../../components/ui/StatCard';
import { colors, radii, typeStyles } from '../../../theme';

export default function StudentDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user) ?? MOCK_USER;
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const nextClass = useMemo(() => getNextClassInfo(), [lastUpdated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setLastUpdated(new Date());
    await Haptics.selectionAsync().catch(() => undefined);
    setRefreshing(false);
  };

  const openNews = (id?: string) => {
    router.push({ pathname: '/(drawer)/news', params: id ? { id } : {} } as never);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />
      <AppHeader
        eyebrow="Student portal"
        title={`${greeting}, ${user.fullName.split(' ')[0]}`}
        subtitle="Here is your academic overview for today."
        right={(
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
            onPress={() => openNews()}
            style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
          >
            <Bell size={21} color="#FFFFFF" />
            <View style={styles.notificationDot} />
          </Pressable>
        )}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open student profile"
          onPress={() => router.push('/(drawer)/(tabs)/profile')}
          style={({ pressed }) => [styles.identityCard, pressed && styles.pressed]}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.identityCopy}>
            <Text style={styles.identityName} numberOfLines={1}>{user.fullName}</Text>
            <Text style={styles.identityMeta} numberOfLines={1}>
              {user.studentId}  •  {user.program}
            </Text>
          </View>
          <ChevronRight size={18} color="rgba(255,255,255,0.72)" />
        </Pressable>
        <View style={styles.semesterRow}>
          <View style={styles.semesterLabel}>
            <CalendarDays size={14} color={colors.gold} />
            <Text style={styles.semesterText}>Spring 2026 • Week 7</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>
      </AppHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.navy}
            colors={[colors.navy, colors.emerald]}
          />
        )}
      >
        <View style={styles.statsRow}>
          <StatCard
            icon={<Award size={20} color={colors.navy} />}
            value={MOCK_DASHBOARD_STATS.currentGPA.toFixed(2)}
            label="Current GPA"
            accentColor={colors.navy}
          />
          <StatCard
            icon={<CheckCircle2 size={20} color={colors.emerald} />}
            value={`${MOCK_DASHBOARD_STATS.attendanceRate}%`}
            label="Attendance"
            accentColor={colors.emerald}
          />
          <StatCard
            icon={<BookCheck size={20} color="#B7791F" />}
            value={`${MOCK_DASHBOARD_STATS.enrolledCredits}`}
            label="Credits"
            accentColor={colors.gold}
          />
        </View>

        <NextClassWidget nextClass={nextClass} />

        <View style={styles.section}>
          <SectionHeader title="Quick services" subtitle="Your most-used campus tools" />
          <ActionGrid items={MOCK_ACTION_ITEMS} />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Attendance"
            subtitle="Semester target: 80% or higher"
            actionLabel="Schedule"
            onAction={() => router.push('/(drawer)/(tabs)/timetable')}
          />
          <Card padding={14}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.attendanceRow}>
                {MOCK_COURSES.map((course) => (
                  <AttendanceRing
                    key={course.id}
                    percentage={course.attendancePercentage}
                    size={72}
                    courseCode={course.code}
                    courseName={course.name}
                    color={course.color}
                  />
                ))}
              </View>
            </ScrollView>
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Announcements"
            subtitle="Updates from the university"
            actionLabel="View all"
            onAction={() => openNews()}
          />
          {MOCK_ANNOUNCEMENTS.map((item) => (
            <Card
              key={item.id}
              onPress={() => openNews(item.id)}
              accessibilityLabel={`Read announcement: ${item.title}`}
              style={styles.newsCard}
            >
              <View style={styles.newsRow}>
                <View style={[styles.categoryBar, styles[`category_${item.category}`]]} />
                <View style={styles.newsCopy}>
                  <View style={styles.newsMetaRow}>
                    <Text style={styles.newsCategory}>{item.category}</Text>
                    <Text style={styles.newsDate}>
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    {!item.isRead ? <View style={styles.unreadDot} /> : null}
                  </View>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
                </View>
                <ChevronRight size={18} color={colors.textSoft} />
              </View>
            </Card>
          ))}
        </View>

        <Text style={styles.updatedText}>
          Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 36 },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  identityCard: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: radii.lg,
    padding: 10,
  },
  avatar: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#DDE7F0', marginRight: 11 },
  identityCopy: { flex: 1, paddingRight: 8 },
  identityName: { fontSize: 15, color: '#FFFFFF', fontWeight: '800' },
  identityMeta: { ...typeStyles.caption, color: 'rgba(255,255,255,0.68)', marginTop: 2 },
  semesterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 },
  semesterLabel: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  semesterText: { ...typeStyles.caption, color: 'rgba(255,255,255,0.78)' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(8,127,91,0.3)' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#63E6BE' },
  activeText: { color: '#D8FFF1', fontSize: 11, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  section: { marginBottom: 24 },
  attendanceRow: { flexDirection: 'row', gap: 20, paddingHorizontal: 2, paddingVertical: 2 },
  newsCard: { marginBottom: 10 },
  newsRow: { flexDirection: 'row', alignItems: 'center' },
  categoryBar: { width: 4, height: 54, borderRadius: 2, marginRight: 12 },
  category_academic: { backgroundColor: colors.info },
  category_event: { backgroundColor: colors.gold },
  category_general: { backgroundColor: colors.emerald },
  category_urgent: { backgroundColor: colors.danger },
  newsCopy: { flex: 1, paddingRight: 10 },
  newsMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  newsCategory: { fontSize: 11, color: colors.emerald, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  newsDate: { fontSize: 11, color: colors.textMuted, marginLeft: 8 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold, marginLeft: 7 },
  newsTitle: { fontSize: 14, lineHeight: 19, color: colors.text, fontWeight: '800' },
  newsSummary: { ...typeStyles.caption, color: colors.textMuted, marginTop: 3 },
  updatedText: { ...typeStyles.caption, color: colors.textSoft, textAlign: 'center', marginBottom: 8 },
  pressed: { opacity: 0.7 },
});

import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarClock, MapPin, UserRound } from 'lucide-react-native';
import type { NextClassInfo } from '../../types';
import { colors, radii, shadows, typeStyles } from '../../theme';

interface NextClassWidgetProps {
  nextClass: NextClassInfo;
}

function getSecondsRemaining(targetTime: string) {
  return Math.max(0, Math.floor((new Date(targetTime).getTime() - Date.now()) / 1000));
}

function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function NextClassWidget({ nextClass }: NextClassWidgetProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(() => getSecondsRemaining(nextClass.startTime));

  useEffect(() => {
    setSecondsRemaining(getSecondsRemaining(nextClass.startTime));
    const interval = setInterval(() => {
      setSecondsRemaining(getSecondsRemaining(nextClass.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextClass.startTime]);

  const startTime = useMemo(
    () => new Date(nextClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [nextClass.startTime],
  );

  return (
    <LinearGradient
      colors={[colors.navy, colors.navyLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
      accessibilityLabel={`Next class ${nextClass.courseName}, starts at ${startTime}`}
    >
      <View pointerEvents="none" style={styles.glow} />
      <View style={styles.topRow}>
        <View style={styles.kickerRow}>
          <View style={styles.iconShell}>
            <CalendarClock size={17} color={colors.gold} />
          </View>
          <View>
            <Text style={styles.kicker}>Next class</Text>
            <Text style={styles.startTime}>Starts at {startTime}</Text>
          </View>
        </View>
        <View style={styles.countdownPill} importantForAccessibility="no-hide-descendants">
          <Text style={styles.countdown}>{formatCountdown(secondsRemaining)}</Text>
        </View>
      </View>

      <Text style={styles.courseName} numberOfLines={2}>{nextClass.courseName}</Text>
      <Text style={styles.courseMeta}>{nextClass.courseCode} • {nextClass.type}</Text>

      <View style={styles.divider} />
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <MapPin size={15} color="#BFD0E2" />
          <Text style={styles.detailText} numberOfLines={1}>{nextClass.room}, {nextClass.building}</Text>
        </View>
        <View style={styles.detail}>
          <UserRound size={15} color="#BFD0E2" />
          <Text style={styles.detailText} numberOfLines={1}>{nextClass.instructor}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: 18,
    marginBottom: 24,
    overflow: 'hidden',
    ...shadows.floating,
  },
  glow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -62,
    bottom: -86,
    backgroundColor: 'rgba(244,183,64,0.12)',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  iconShell: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.10)', marginRight: 10 },
  kicker: { ...typeStyles.eyebrow, color: colors.gold },
  startTime: { fontSize: 12, color: 'rgba(255,255,255,0.68)', fontWeight: '600', marginTop: 2 },
  countdownPill: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.11)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  countdown: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: 0.5 },
  courseName: { color: '#FFFFFF', fontSize: 20, lineHeight: 25, fontWeight: '800', letterSpacing: -0.25 },
  courseMeta: { ...typeStyles.caption, color: 'rgba(255,255,255,0.68)', marginTop: 4, textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 14 },
  detailsRow: { gap: 8 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  detailText: { ...typeStyles.caption, color: '#E7EFF7', flex: 1 },
});

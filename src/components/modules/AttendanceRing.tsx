import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface AttendanceRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  courseCode?: string;
  courseName?: string;
}

export const AttendanceRing: React.FC<AttendanceRingProps> = ({
  percentage,
  size = 76,
  strokeWidth = 7,
  color,
  courseCode,
  courseName,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedPercentage = Math.max(0, Math.min(percentage, 100));
  const strokeDashoffset = circumference - (circumference * normalizedPercentage) / 100;

  // Determine indicator color based on percentage threshold
  const activeColor =
    percentage >= 85 ? '#00875A' : percentage >= 75 ? '#FFAB00' : '#EF4444';
  const ringColor = color ?? activeColor;
  const attendanceState = percentage >= 85 ? 'On track' : percentage >= 75 ? 'Watch' : 'At risk';

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${courseCode ?? 'Course'} attendance ${normalizedPercentage} percent, ${attendanceState}`}
    >
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Track Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
        {/* Percentage Label inside Ring */}
        <View style={[StyleSheet.absoluteFill, styles.innerContent]}>
          <Text style={[styles.percentageText, { color: ringColor }]}>
            {normalizedPercentage}%
          </Text>
        </View>
      </View>

      {courseCode && (
        <View style={styles.infoContainer}>
          <Text style={styles.courseCode}>{courseCode}</Text>
          {courseName && (
            <Text style={styles.courseName} numberOfLines={1}>
              {courseName}
            </Text>
          )}
          <Text style={[styles.statusText, { color: activeColor }]}>{attendanceState}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '800',
  },
  infoContainer: {
    marginTop: 6,
    alignItems: 'center',
    maxWidth: 90,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#002147',
  },
  courseName: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});

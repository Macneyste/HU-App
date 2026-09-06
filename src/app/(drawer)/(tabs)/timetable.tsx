/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Hormuud University (HU) Mobile Application
 *  Academic & Timetable Schedule Screen
 *
 *  Features:
 *   - Interactive Day-of-Week Picker (Saturday - Thursday academic cycle)
 *   - Daily lecture timeline with room locations, buildings, and instructors
 *   - Type Badges: Lecture, Lab, Tutorial
 *   - Segmented Switch to Semester Gradebook & Transcript breakdown
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Award,
  BookOpen,
} from 'lucide-react-native';
import { MOCK_SCHEDULE, MOCK_SEMESTER_GRADES } from '../../../data/mockData';
import type { DayOfWeek } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { AppHeader } from '../../../components/ui/AppHeader';
import { colors } from '../../../theme';

const DAYS: DayOfWeek[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Saturday');
  const [activeTab, setActiveTab] = useState<'schedule' | 'grades'>('schedule');

  // Filter lectures for chosen day
  const dailyLectures = MOCK_SCHEDULE.filter((item) => item.dayOfWeek === selectedDay);
  const currentSemester = MOCK_SEMESTER_GRADES[0];
  const weekDates = useMemo(() => {
    const today = new Date();
    const daysSinceSaturday = (today.getDay() + 1) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - daysSinceSaturday);

    return DAYS.reduce<Record<DayOfWeek, string>>((dates, day, index) => {
      const date = new Date(saturday);
      date.setDate(saturday.getDate() + index);
      dates[day] = date.toLocaleDateString('en-US', { day: '2-digit' });
      return dates;
    }, {} as Record<DayOfWeek, string>);
  }, []);

  return (
    <View className="flex-1 bg-hu-bg">
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <AppHeader
        eyebrow="Academics"
        title="Schedule & results"
        subtitle="Semester 6 • Spring 2026"
      >

        {/* ─── Segment Switcher (Schedule vs Grades) ─────────────────── */}
        <View className="flex-row bg-black/20 p-1 rounded-xl">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('schedule')}
            accessibilityRole="tab"
            accessibilityLabel="Weekly schedule"
            accessibilityState={{ selected: activeTab === 'schedule' }}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
              activeTab === 'schedule' ? 'bg-white shadow' : 'bg-transparent'
            }`}
          >
            <CalendarDays
              size={16}
              color={activeTab === 'schedule' ? '#002147' : '#FFFFFF'}
              style={{ marginRight: 6 }}
            />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'schedule' ? 'text-hu-primary' : 'text-white'
              }`}
            >
              Weekly Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('grades')}
            accessibilityRole="tab"
            accessibilityLabel="Gradebook"
            accessibilityState={{ selected: activeTab === 'grades' }}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
              activeTab === 'grades' ? 'bg-white shadow' : 'bg-transparent'
            }`}
          >
            <GraduationCap
              size={16}
              color={activeTab === 'grades' ? '#002147' : '#FFFFFF'}
              style={{ marginRight: 6 }}
            />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'grades' ? 'text-hu-primary' : 'text-white'
              }`}
            >
              Gradebook
            </Text>
          </TouchableOpacity>
        </View>
      </AppHeader>

      {/* ─── SCHEDULE VIEW ───────────────────────────────────────────── */}
      {activeTab === 'schedule' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        >
          {/* Day-of-Week Pills Picker */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          >
            {DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const shortDay = day.substring(0, 3);

              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDay(day)}
                  accessibilityRole="button"
                  accessibilityLabel={`Show classes for ${day}`}
                  accessibilityState={{ selected: isSelected }}
                  className={`px-4 py-2.5 rounded-xl items-center min-w-[62px] border ${
                    isSelected
                      ? 'bg-hu-primary border-hu-primary shadow-sm'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-[11px] uppercase font-bold tracking-wider ${
                      isSelected ? 'text-hu-accent' : 'text-gray-400'
                    }`}
                  >
                    {shortDay}
                  </Text>
                  <Text
                    className={`text-sm font-black mt-0.5 ${
                      isSelected ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {weekDates[day]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Schedule List */}
          <View className="mb-2">
            <Text className="text-hu-primary font-black text-sm mb-3">
              {selectedDay}'s Classes ({dailyLectures.length} sessions)
            </Text>

            {dailyLectures.length === 0 ? (
              <Card shadow="sm">
                <View className="py-8 items-center justify-center">
                  <Clock size={36} color="#94A3B8" />
                  <Text className="text-gray-500 font-bold text-sm mt-3">No Classes Scheduled</Text>
                  <Text className="text-gray-400 text-xs mt-1">Enjoy your study break</Text>
                </View>
              </Card>
            ) : (
              dailyLectures.map((item) => (
                <Card
                  key={item.id}
                  shadow="sm"
                  style={{
                    marginBottom: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: item.color,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Clock size={14} color="#002147" style={{ marginRight: 6 }} />
                      <Text className="text-gray-800 font-extrabold text-xs">
                        {item.startTime} – {item.endTime}
                      </Text>
                    </View>
                    <Badge
                      label={item.type.toUpperCase()}
                      variant={
                        item.type === 'lab'
                          ? 'success'
                          : item.type === 'lecture'
                          ? 'primary'
                          : 'warning'
                      }
                      size="sm"
                    />
                  </View>

                  <Text className="text-gray-950 font-black text-base mb-1">
                    {item.courseName}
                  </Text>
                  <Text className="text-gray-500 text-xs font-semibold mb-3">
                    Course Code: {item.courseCode}
                  </Text>

                  <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                    <View className="flex-row items-center">
                      <MapPin size={13} color="#00875A" style={{ marginRight: 4 }} />
                      <Text className="text-gray-700 text-xs font-semibold">
                        {item.room}, {item.building}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <User size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text className="text-gray-600 text-xs">{item.instructor}</Text>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* ─── GRADEBOOK & TRANSCRIPT VIEW ─────────────────────────────── */}
      {activeTab === 'grades' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        >
          {/* GPA Summary Card */}
          <Card shadow="md" style={{ marginBottom: 16, backgroundColor: '#002147' }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                  Cumulative GPA
                </Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="text-white text-3xl font-black">
                    {currentSemester.cumulativeGPA.toFixed(2)}
                  </Text>
                  <Text className="text-gray-300 text-sm ml-1 font-bold">/ 4.00</Text>
                </View>
                <Text className="text-hu-accent text-xs font-bold mt-1">
                  Dean's First Class Honors
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                  Semester GPA
                </Text>
                <Text className="text-hu-secondary-light text-2xl font-black mt-1">
                  {currentSemester.semesterGPA.toFixed(2)}
                </Text>
                <Text className="text-gray-300 text-xs mt-1">
                  {currentSemester.earnedCredits} Credits Earned
                </Text>
              </View>
            </View>
          </Card>

          {/* Courses Marks Breakdown */}
          <Text className="text-hu-primary font-black text-sm mb-3">
            Spring 2026 Marks Breakdown
          </Text>

          {currentSemester.courses.map((grade) => (
            <Card key={grade.courseId} shadow="sm" style={{ marginBottom: 12 }}>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="text-gray-900 font-extrabold text-sm">
                    {grade.courseName}
                  </Text>
                  <Text className="text-gray-400 text-xs font-semibold">
                    {grade.courseCode} · {grade.creditHours} Credits
                  </Text>
                </View>
                <View className="bg-hu-primary px-3 py-1 rounded-xl items-center">
                  <Text className="text-white font-black text-sm">{grade.letterGrade}</Text>
                  <Text className="text-hu-accent text-[10px] font-bold">{grade.gradePoint}</Text>
                </View>
              </View>

              {/* Breakdown Grid: Assignment / Midterm / Final / Total */}
              <View className="flex-row justify-between bg-gray-50 p-2.5 rounded-xl mt-2 border border-gray-100">
                <View className="items-center flex-1">
                  <Text className="text-gray-400 text-[10px] font-bold">ASSIGN (20)</Text>
                  <Text className="text-gray-800 font-extrabold text-xs mt-0.5">
                    {grade.assignment}
                  </Text>
                </View>
                <View className="w-[1px] bg-gray-200" />
                <View className="items-center flex-1">
                  <Text className="text-gray-400 text-[10px] font-bold">MIDTERM (30)</Text>
                  <Text className="text-gray-800 font-extrabold text-xs mt-0.5">
                    {grade.midterm}
                  </Text>
                </View>
                <View className="w-[1px] bg-gray-200" />
                <View className="items-center flex-1">
                  <Text className="text-gray-400 text-[10px] font-bold">FINAL (50)</Text>
                  <Text className="text-gray-800 font-extrabold text-xs mt-0.5">
                    {grade.finalExam}
                  </Text>
                </View>
                <View className="w-[1px] bg-gray-200" />
                <View className="items-center flex-1">
                  <Text className="text-hu-secondary text-[10px] font-bold">TOTAL (100)</Text>
                  <Text className="text-hu-secondary font-black text-xs mt-0.5">
                    {grade.total}%
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bell,
  BellOff,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  MapPin,
  Printer,
  Share2,
  ShieldCheck,
  UserRoundCheck,
  X,
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { MOCK_COURSES, MOCK_USER } from '../../data/mockData';
import { useAuthStore } from '../../store/useAuthStore';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

interface ExamEntry {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  building: string;
  seat: string;
  invigilator: string;
}

const EXAM_LOGISTICS = [
  { date: '2026-10-19', time: '08:00 AM', duration: '2 hours', room: 'Hall A1', building: 'Main Hall', seat: 'A-18' },
  { date: '2026-10-20', time: '10:30 AM', duration: '2 hours', room: 'Hall B2', building: 'Block B', seat: 'B-07' },
  { date: '2026-10-22', time: '08:00 AM', duration: '2 hours', room: 'Hall A2', building: 'Main Hall', seat: 'A-24' },
  { date: '2026-10-24', time: '01:00 PM', duration: '2 hours', room: 'ICT Hall', building: 'ICT Centre', seat: 'C-11' },
  { date: '2026-10-26', time: '08:00 AM', duration: '90 minutes', room: 'Hall 01', building: 'Main Hall', seat: 'D-03' },
  { date: '2026-10-28', time: '10:30 AM', duration: '2 hours', room: 'Hall B1', building: 'Block B', seat: 'B-16' },
];

const EXAMS: ExamEntry[] = MOCK_COURSES.map((course, index) => ({
  id: `exam_${course.id}`,
  courseCode: course.code,
  courseName: course.name,
  invigilator: course.instructor,
  ...EXAM_LOGISTICS[index],
}));

const formatExamDate = (value: string, includeYear = false) =>
  new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' as const } : {}),
  });

export default function ExamCardScreen() {
  const storedUser = useAuthStore((state) => state.user);
  const user = storedUser ?? MOCK_USER;
  const [selectedExam, setSelectedExam] = useState<ExamEntry | null>(null);
  const [reminderIds, setReminderIds] = useState<string[]>([]);

  const cardReference = useMemo(
    () => `HU-EX-${user.studentId.replace(/[^A-Z0-9]/gi, '')}-S06-2026`,
    [user.studentId],
  );

  const verificationPayload = useMemo(
    () =>
      JSON.stringify({
        institution: 'Hormuud University',
        studentId: user.studentId,
        cardReference,
        semester: 6,
        year: 2026,
        status: 'eligible',
      }),
    [cardReference, user.studentId],
  );

  const shareExamCard = async () => {
    const schedule = EXAMS.map(
      (exam) =>
        `${formatExamDate(exam.date)} · ${exam.time}\n${exam.courseCode} — ${exam.courseName}\n${exam.room}, ${exam.building} · Seat ${exam.seat}`,
    ).join('\n\n');

    try {
      await Share.share({
        title: `HU exam card — ${user.studentId}`,
        message: [
          'Hormuud University — Semester 6 Examination Card',
          `${user.fullName} · ${user.studentId}`,
          `Reference: ${cardReference}`,
          '',
          schedule,
          '',
          'Bring your physical or digital student ID to every examination.',
        ].join('\n'),
      });
    } catch {
      Alert.alert('Unable to share', 'Your device could not open the share menu. Please try again.');
    }
  };

  const showPrintInstructions = () => {
    Alert.alert(
      'Print-ready exam card',
      `Reference ${cardReference}\n\nFor a paper backup, open portal.hu.edu.so on a computer, choose Exams → Admission Card, then select Print. The QR code and Registrar seal must remain visible.`,
      [{ text: 'Done' }],
    );
  };

  const toggleReminder = () => {
    if (!selectedExam) return;

    const alreadySet = reminderIds.includes(selectedExam.id);
    setReminderIds((current) =>
      alreadySet ? current.filter((id) => id !== selectedExam.id) : [...current, selectedExam.id],
    );
    Alert.alert(
      alreadySet ? 'Reminder removed' : 'Reminder saved',
      alreadySet
        ? `The local reminder for ${selectedExam.courseCode} was removed.`
        : `A local reminder was saved for ${selectedExam.courseCode} on ${formatExamDate(selectedExam.date, true)} at ${selectedExam.time}.`,
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#002147" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <FileCheck2 size={25} color="#FFAB00" />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>SEMESTER 6 · 2026</Text>
              <Text style={styles.heroTitle}>Examination Admission Card</Text>
              <Text style={styles.heroSubtitle}>Midterm examination session</Text>
            </View>
          </View>

          <View style={styles.statusBanner}>
            <View style={styles.statusIcon}>
              <CheckCircle2 size={19} color="#047857" />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>CLEARED TO SIT EXAMS</Text>
              <Text style={styles.statusText}>Registration and finance clearance verified</Text>
            </View>
            <Badge label="ELIGIBLE" variant="success" size="sm" />
          </View>
        </View>

        <View style={styles.body}>
          <Card shadow="md" padding={0} style={styles.identityCard}>
            <View style={styles.identityHeader}>
              <View>
                <Text style={styles.identityHeaderLabel}>OFFICIAL CANDIDATE PASS</Text>
                <Text style={styles.identityHeaderRef}>{cardReference}</Text>
              </View>
              <ShieldCheck size={22} color="#FFAB00" />
            </View>

            <View style={styles.identityBody}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} resizeMode="cover" />
              <View style={styles.studentCopy}>
                <Text style={styles.studentName} numberOfLines={1}>{user.fullName}</Text>
                <Text style={styles.studentId}>{user.studentId}</Text>
                <Text style={styles.studentProgram} numberOfLines={2}>{user.program}</Text>
                <View style={styles.identityVerifiedRow}>
                  <UserRoundCheck size={13} color="#00875A" />
                  <Text style={styles.identityVerifiedText}>Identity verified</Text>
                </View>
              </View>
              <View
                style={styles.qrBox}
                accessible
                accessibilityRole="image"
                accessibilityLabel={`Verification QR code for exam card ${cardReference}`}
              >
                <QRCode
                  value={verificationPayload}
                  size={78}
                  color="#002147"
                  backgroundColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.identityFooter}>
              <View>
                <Text style={styles.footerLabel}>FACULTY</Text>
                <Text style={styles.footerValue} numberOfLines={1}>{user.faculty.replace('Faculty of ', '')}</Text>
              </View>
              <View style={styles.footerDivider} />
              <View>
                <Text style={styles.footerLabel}>EXAMS</Text>
                <Text style={styles.footerValue}>{EXAMS.length} registered</Text>
              </View>
              <View style={styles.footerDivider} />
              <View>
                <Text style={styles.footerLabel}>VALID UNTIL</Text>
                <Text style={styles.footerValue}>Oct 28, 2026</Text>
              </View>
            </View>
          </Card>

          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={shareExamCard}
              accessibilityRole="button"
              accessibilityLabel="Share examination card and schedule"
              style={[styles.actionButton, styles.shareAction]}
            >
              <Share2 size={17} color="#FFFFFF" />
              <Text style={styles.shareActionText}>Share Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={showPrintInstructions}
              accessibilityRole="button"
              accessibilityLabel="Show exam card printing instructions"
              style={[styles.actionButton, styles.printAction]}
            >
              <Printer size={17} color="#002147" />
              <Text style={styles.printActionText}>Print Guide</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.sectionTitle}>Examination schedule</Text>
              <Text style={styles.sectionSubtitle}>Tap any course for venue and reminder options</Text>
            </View>
            <View style={styles.examCount}>
              <Text style={styles.examCountText}>{EXAMS.length}</Text>
            </View>
          </View>

          {EXAMS.map((exam, index) => {
            const reminderSet = reminderIds.includes(exam.id);
            return (
              <TouchableOpacity
                key={exam.id}
                activeOpacity={0.82}
                onPress={() => setSelectedExam(exam)}
                accessibilityRole="button"
                accessibilityLabel={`${exam.courseCode}, ${exam.courseName}, ${formatExamDate(exam.date, true)} at ${exam.time}, seat ${exam.seat}${reminderSet ? ', reminder set' : ''}`}
                accessibilityHint="Opens exam details"
                style={styles.examPressable}
              >
                <Card shadow="sm" padding={0}>
                  <View style={styles.examCard}>
                    <View style={styles.dateTile}>
                      <Text style={styles.dateMonth}>
                        {new Date(`${exam.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </Text>
                      <Text style={styles.dateDay}>{new Date(`${exam.date}T12:00:00`).getDate()}</Text>
                      <Text style={styles.dateWeekday}>
                        {new Date(`${exam.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                    </View>

                    <View style={styles.examCopy}>
                      <View style={styles.examCodeRow}>
                        <Text style={styles.examCode}>{exam.courseCode}</Text>
                        {reminderSet && (
                          <View style={styles.reminderBadge}>
                            <Bell size={11} color="#00875A" />
                            <Text style={styles.reminderBadgeText}>Reminder</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.examName} numberOfLines={1}>{exam.courseName}</Text>
                      <View style={styles.examMetaRow}>
                        <Clock3 size={12} color="#64748B" />
                        <Text style={styles.examMetaText}>{exam.time}</Text>
                        <View style={styles.metaDot} />
                        <MapPin size={12} color="#64748B" />
                        <Text style={styles.examMetaText} numberOfLines={1}>{exam.room}</Text>
                      </View>
                    </View>

                    <View style={styles.seatColumn}>
                      <Text style={styles.seatLabel}>SEAT</Text>
                      <Text style={styles.seatValue}>{exam.seat}</Text>
                      <ChevronRight size={17} color="#94A3B8" />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          <View style={styles.rulesNotice}>
            <ShieldCheck size={19} color="#B45309" />
            <View style={styles.rulesCopy}>
              <Text style={styles.rulesTitle}>Before entering the hall</Text>
              <Text style={styles.rulesText}>
                Arrive 30 minutes early with this card and your student ID. Phones, smart watches,
                notes, and programmable calculators are not permitted unless authorized.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedExam !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSelectedExam(null)}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSelectedExam(null)}
            accessibilityRole="button"
            accessibilityLabel="Close exam details"
            style={StyleSheet.absoluteFill}
          />

          {selectedExam && (
            <View style={styles.modalCard} accessibilityViewIsModal>
              <View style={styles.modalTopRow}>
                <View style={styles.modalCodePill}>
                  <Text style={styles.modalCode}>{selectedExam.courseCode}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.72}
                  onPress={() => setSelectedExam(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Close exam details"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeButton}
                >
                  <X size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>{selectedExam.courseName}</Text>
              <Text style={styles.modalSubtitle}>Registered midterm examination</Text>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <CalendarDays size={17} color="#002147" />
                  <Text style={styles.detailLabel}>DATE</Text>
                  <Text style={styles.detailValue}>{formatExamDate(selectedExam.date, true)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock3 size={17} color="#002147" />
                  <Text style={styles.detailLabel}>TIME</Text>
                  <Text style={styles.detailValue}>{selectedExam.time}</Text>
                  <Text style={styles.detailHint}>{selectedExam.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={17} color="#002147" />
                  <Text style={styles.detailLabel}>VENUE</Text>
                  <Text style={styles.detailValue}>{selectedExam.room}</Text>
                  <Text style={styles.detailHint}>{selectedExam.building}</Text>
                </View>
                <View style={styles.detailItem}>
                  <UserRoundCheck size={17} color="#002147" />
                  <Text style={styles.detailLabel}>SEAT</Text>
                  <Text style={styles.detailValue}>{selectedExam.seat}</Text>
                  <Text style={styles.detailHint}>Assigned</Text>
                </View>
              </View>

              <View style={styles.invigilatorRow}>
                <Text style={styles.invigilatorLabel}>Lead invigilator</Text>
                <Text style={styles.invigilatorValue}>{selectedExam.invigilator}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={toggleReminder}
                accessibilityRole="button"
                accessibilityLabel={
                  reminderIds.includes(selectedExam.id)
                    ? `Remove reminder for ${selectedExam.courseCode}`
                    : `Set reminder for ${selectedExam.courseCode}`
                }
                accessibilityState={{ selected: reminderIds.includes(selectedExam.id) }}
                style={[
                  styles.reminderAction,
                  reminderIds.includes(selectedExam.id) && styles.reminderActionActive,
                ]}
              >
                {reminderIds.includes(selectedExam.id) ? (
                  <BellOff size={18} color="#002147" />
                ) : (
                  <Bell size={18} color="#FFFFFF" />
                )}
                <Text
                  style={[
                    styles.reminderActionText,
                    reminderIds.includes(selectedExam.id) && styles.reminderActionTextActive,
                  ]}
                >
                  {reminderIds.includes(selectedExam.id) ? 'Remove Reminder' : 'Set Exam Reminder'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FA' },
  scrollContent: { paddingBottom: 36 },
  hero: {
    backgroundColor: '#002147',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center' },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(255,171,0,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,171,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, marginLeft: 12 },
  eyebrow: { color: '#FFAB00', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 2 },
  heroSubtitle: { color: '#CBD5E1', fontSize: 11, fontWeight: '600', marginTop: 2 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginTop: 19,
  },
  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCopy: { flex: 1, marginHorizontal: 10 },
  statusTitle: { color: '#047857', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  statusText: { color: '#64748B', fontSize: 9.5, fontWeight: '600', marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 18 },
  identityCard: { marginBottom: 0, overflow: 'hidden' },
  identityHeader: {
    minHeight: 58,
    backgroundColor: '#002147',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identityHeaderLabel: { color: '#FFAB00', fontSize: 9, fontWeight: '900', letterSpacing: 0.9 },
  identityHeaderRef: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', marginTop: 3, letterSpacing: 0.4 },
  identityBody: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  avatar: { width: 66, height: 66, borderRadius: 18, backgroundColor: '#E2E8F0', borderWidth: 2, borderColor: '#FFAB00' },
  studentCopy: { flex: 1, marginHorizontal: 12 },
  studentName: { color: '#0F172A', fontSize: 16, fontWeight: '900' },
  studentId: { color: '#00875A', fontSize: 12, fontWeight: '900', marginTop: 2, letterSpacing: 0.5 },
  studentProgram: { color: '#64748B', fontSize: 10, lineHeight: 14, fontWeight: '600', marginTop: 3 },
  identityVerifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  identityVerifiedText: { color: '#047857', fontSize: 9, fontWeight: '800' },
  qrBox: { padding: 6, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, backgroundColor: '#FFFFFF' },
  identityFooter: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 15,
  },
  footerLabel: { color: '#94A3B8', fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  footerValue: { color: '#1E293B', fontSize: 9.5, fontWeight: '800', marginTop: 2, maxWidth: 105 },
  footerDivider: { width: 1, height: 27, backgroundColor: '#E2E8F0' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 13, marginBottom: 24 },
  actionButton: {
    minHeight: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
  },
  shareAction: { backgroundColor: '#00875A' },
  printAction: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1' },
  shareActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  printActionText: { color: '#002147', fontSize: 13, fontWeight: '900' },
  sectionHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#002147', fontSize: 17, fontWeight: '900' },
  sectionSubtitle: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 },
  examCount: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  examCountText: { color: '#002147', fontSize: 12, fontWeight: '900' },
  examPressable: { marginBottom: 10 },
  examCard: { minHeight: 91, flexDirection: 'row', alignItems: 'center', padding: 11 },
  dateTile: { width: 54, height: 67, borderRadius: 13, backgroundColor: '#002147', alignItems: 'center', justifyContent: 'center' },
  dateMonth: { color: '#FFAB00', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  dateDay: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', lineHeight: 23 },
  dateWeekday: { color: '#CBD5E1', fontSize: 9, fontWeight: '700' },
  examCopy: { flex: 1, marginLeft: 12, marginRight: 6 },
  examCodeRow: { flexDirection: 'row', alignItems: 'center' },
  examCode: { color: '#00875A', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  reminderBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ECFDF5', borderRadius: 7, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 7 },
  reminderBadgeText: { color: '#047857', fontSize: 8, fontWeight: '900' },
  examName: { color: '#0F172A', fontSize: 13, fontWeight: '900', marginTop: 3 },
  examMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 7 },
  examMetaText: { color: '#64748B', fontSize: 9.5, fontWeight: '700', maxWidth: 72 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 2 },
  seatColumn: { alignItems: 'center', paddingLeft: 7, borderLeftWidth: 1, borderLeftColor: '#F1F5F9' },
  seatLabel: { color: '#94A3B8', fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  seatValue: { color: '#002147', fontSize: 12, fontWeight: '900', marginVertical: 4 },
  rulesNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 15, padding: 14, marginTop: 5 },
  rulesCopy: { flex: 1 },
  rulesTitle: { color: '#92400E', fontSize: 12, fontWeight: '900' },
  rulesText: { color: '#78520C', fontSize: 10.5, lineHeight: 16, fontWeight: '600', marginTop: 3 },
  modalRoot: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.64)', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#000000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.22, shadowRadius: 24, elevation: 12 },
  modalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalCodePill: { backgroundColor: '#ECFDF5', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  modalCode: { color: '#047857', fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  closeButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' },
  modalTitle: { color: '#0F172A', fontSize: 19, lineHeight: 24, fontWeight: '900', marginTop: 12 },
  modalSubtitle: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 3 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 18 },
  detailItem: { width: '48%', minHeight: 98, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 11 },
  detailLabel: { color: '#94A3B8', fontSize: 8, fontWeight: '900', letterSpacing: 0.7, marginTop: 7 },
  detailValue: { color: '#0F172A', fontSize: 11.5, fontWeight: '900', marginTop: 2 },
  detailHint: { color: '#64748B', fontSize: 9, fontWeight: '600', marginTop: 2 },
  invigilatorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 48, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginTop: 7 },
  invigilatorLabel: { color: '#64748B', fontSize: 10.5, fontWeight: '700' },
  invigilatorValue: { color: '#002147', fontSize: 10.5, fontWeight: '900', maxWidth: '58%', textAlign: 'right' },
  reminderAction: { minHeight: 50, borderRadius: 14, backgroundColor: '#00875A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18 },
  reminderActionActive: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' },
  reminderActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  reminderActionTextActive: { color: '#002147' },
});

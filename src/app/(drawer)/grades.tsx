import React, { useMemo, useState } from 'react';
import {
  Alert,
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
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  FileText,
  Printer,
  Share2,
  Sparkles,
  X,
} from 'lucide-react-native';
import { MOCK_SEMESTER_GRADES } from '../../data/mockData';
import type { Grade, SemesterGrades } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const semesterKey = (semester: SemesterGrades) => `${semester.year}-${semester.semester}`;

const gradeTone = (grade: string) => {
  if (grade.startsWith('A')) return { background: '#DCFCE7', foreground: '#047857' };
  if (grade.startsWith('B')) return { background: '#E0F2FE', foreground: '#0369A1' };
  return { background: '#FEF3C7', foreground: '#B45309' };
};

export default function GradesScreen() {
  const [selectedSemesterKey, setSelectedSemesterKey] = useState(() =>
    semesterKey(MOCK_SEMESTER_GRADES[0]),
  );
  const [selectedCourse, setSelectedCourse] = useState<Grade | null>(null);

  const semester = useMemo(
    () =>
      MOCK_SEMESTER_GRADES.find((item) => semesterKey(item) === selectedSemesterKey) ??
      MOCK_SEMESTER_GRADES[0],
    [selectedSemesterKey],
  );

  const completedAssessments = semester.courses.length * 3;

  const shareTranscript = async () => {
    const courseLines = semester.courses
      .map(
        (course) =>
          `${course.courseCode} — ${course.courseName}: ${course.letterGrade} (${course.total}%)`,
      )
      .join('\n');

    try {
      await Share.share({
        title: `HU results — ${semester.label}`,
        message: [
          'Hormuud University — Unofficial Academic Results',
          semester.label,
          `Semester GPA: ${semester.semesterGPA.toFixed(2)} · Cumulative GPA: ${semester.cumulativeGPA.toFixed(2)}`,
          '',
          courseLines,
          '',
          'Shared from the HU Mobile Campus Portal.',
        ].join('\n'),
      });
    } catch {
      Alert.alert('Unable to share', 'Your device could not open the share menu. Please try again.');
    }
  };

  const showOfficialCopyInstructions = () => {
    Alert.alert(
      'Official transcript request',
      'A print-ready official transcript must be stamped by the Registrar. Take your student ID to Block A, or submit a request through the university portal.',
      [{ text: 'Understood' }],
    );
  };

  const shareCourseResult = async () => {
    if (!selectedCourse) return;

    try {
      await Share.share({
        title: `${selectedCourse.courseCode} result`,
        message: `${selectedCourse.courseCode} — ${selectedCourse.courseName}\nTotal: ${selectedCourse.total}%\nGrade: ${selectedCourse.letterGrade}\nGrade point: ${selectedCourse.gradePoint.toFixed(1)}`,
      });
    } catch {
      Alert.alert('Unable to share', 'Your device could not open the share menu. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#002147" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.heroHeadingRow}>
            <View style={styles.heroIcon}>
              <Award size={24} color="#FFAB00" />
            </View>
            <View style={styles.heroHeadingCopy}>
              <Text style={styles.eyebrow}>ACADEMIC PERFORMANCE</Text>
              <Text style={styles.heroTitle}>Results & Transcript</Text>
              <Text style={styles.heroSubtitle}>{semester.label}</Text>
            </View>
            <Badge label="VERIFIED" variant="success" size="sm" />
          </View>

          <View style={styles.gpaRow}>
            <View style={styles.gpaPrimary}>
              <Text style={styles.gpaLabel}>CUMULATIVE GPA</Text>
              <View style={styles.gpaValueRow}>
                <Text style={styles.gpaValue}>{semester.cumulativeGPA.toFixed(2)}</Text>
                <Text style={styles.gpaOutOf}> / 4.00</Text>
              </View>
              <View style={styles.honoursRow}>
                <Sparkles size={13} color="#FFAB00" />
                <Text style={styles.honoursText}>Excellent academic standing</Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.gpaSecondary}>
              <Text style={styles.gpaLabel}>SEMESTER GPA</Text>
              <Text style={styles.semesterGpa}>{semester.semesterGPA.toFixed(2)}</Text>
              <Text style={styles.creditText}>
                {semester.earnedCredits}/{semester.totalCredits} credits earned
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>SELECT SEMESTER</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.semesterList}
          >
            {MOCK_SEMESTER_GRADES.map((item) => {
              const key = semesterKey(item);
              const selected = key === selectedSemesterKey;
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.78}
                  onPress={() => setSelectedSemesterKey(key)}
                  accessibilityRole="button"
                  accessibilityLabel={`Show results for ${item.label}`}
                  accessibilityState={{ selected }}
                  style={[styles.semesterButton, selected && styles.semesterButtonSelected]}
                >
                  <Text style={[styles.semesterButtonTitle, selected && styles.semesterButtonTitleSelected]}>
                    Semester {item.semester}
                  </Text>
                  <Text style={[styles.semesterButtonMeta, selected && styles.semesterButtonMetaSelected]}>
                    {item.label.replace(' (Current)', '')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={shareTranscript}
              accessibilityRole="button"
              accessibilityLabel={`Share unofficial results for ${semester.label}`}
              style={[styles.actionButton, styles.actionButtonPrimary]}
            >
              <Share2 size={17} color="#FFFFFF" />
              <Text style={styles.actionButtonPrimaryText}>Share Results</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={showOfficialCopyInstructions}
              accessibilityRole="button"
              accessibilityLabel="View official transcript request instructions"
              style={[styles.actionButton, styles.actionButtonSecondary]}
            >
              <Printer size={17} color="#002147" />
              <Text style={styles.actionButtonSecondaryText}>Official Copy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.sectionTitle}>Course results</Text>
              <Text style={styles.sectionSubtitle}>
                {semester.courses.length} courses · {completedAssessments} assessments recorded
              </Text>
            </View>
            <View style={styles.completionBadge}>
              <CheckCircle2 size={14} color="#00875A" />
              <Text style={styles.completionText}>Complete</Text>
            </View>
          </View>

          {semester.courses.map((course) => {
            const tone = gradeTone(course.letterGrade);
            return (
              <TouchableOpacity
                key={course.courseId}
                activeOpacity={0.82}
                onPress={() => setSelectedCourse(course)}
                accessibilityRole="button"
                accessibilityLabel={`${course.courseCode}, ${course.courseName}, grade ${course.letterGrade}, ${course.total} percent`}
                accessibilityHint="Opens the assessment breakdown"
                style={styles.coursePressable}
              >
                <Card shadow="sm" padding={0}>
                  <View style={styles.courseCard}>
                    <View style={styles.courseTopRow}>
                      <View style={styles.courseIcon}>
                        <BookOpenCheck size={20} color="#002147" />
                      </View>
                      <View style={styles.courseCopy}>
                        <Text style={styles.courseCode}>{course.courseCode}</Text>
                        <Text style={styles.courseName} numberOfLines={1}>
                          {course.courseName}
                        </Text>
                        <Text style={styles.courseCredits}>{course.creditHours} credit hours</Text>
                      </View>
                      <View style={[styles.letterGrade, { backgroundColor: tone.background }]}>
                        <Text style={[styles.letterGradeText, { color: tone.foreground }]}>
                          {course.letterGrade}
                        </Text>
                      </View>
                      <ChevronRight size={18} color="#94A3B8" />
                    </View>

                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Overall score</Text>
                      <Text style={styles.scoreValue}>{course.total}%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.min(course.total, 100)}%` }]} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          <View style={styles.notice}>
            <FileText size={18} color="#0369A1" />
            <Text style={styles.noticeText}>
              These results are for reference. Only a Registrar-stamped transcript is an official
              university record.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedCourse !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSelectedCourse(null)}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSelectedCourse(null)}
            accessibilityRole="button"
            accessibilityLabel="Close result details"
            style={StyleSheet.absoluteFill}
          />

          {selectedCourse && (
            <View style={styles.modalCard} accessibilityViewIsModal>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderCopy}>
                  <Text style={styles.modalEyebrow}>{selectedCourse.courseCode}</Text>
                  <Text style={styles.modalTitle}>{selectedCourse.courseName}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.72}
                  onPress={() => setSelectedCourse(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Close result details"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeButton}
                >
                  <X size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalResultRow}>
                <View>
                  <Text style={styles.modalResultLabel}>FINAL RESULT</Text>
                  <Text style={styles.modalResultScore}>{selectedCourse.total}%</Text>
                </View>
                <View style={styles.modalGradePill}>
                  <Award size={19} color="#FFAB00" />
                  <View>
                    <Text style={styles.modalGradeLabel}>GRADE</Text>
                    <Text style={styles.modalGradeValue}>
                      {selectedCourse.letterGrade} · {selectedCourse.gradePoint.toFixed(1)} points
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.breakdownTitle}>Assessment breakdown</Text>
              {[
                { label: 'Assignments', value: selectedCourse.assignment, maximum: 20 },
                { label: 'Midterm exam', value: selectedCourse.midterm, maximum: 30 },
                { label: 'Final exam', value: selectedCourse.finalExam, maximum: 50 },
              ].map((assessment) => (
                <View key={assessment.label} style={styles.assessmentRow}>
                  <Text style={styles.assessmentLabel}>{assessment.label}</Text>
                  <View style={styles.assessmentScorePill}>
                    <Text style={styles.assessmentScore}>
                      {assessment.value} / {assessment.maximum}
                    </Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={shareCourseResult}
                accessibilityRole="button"
                accessibilityLabel={`Share ${selectedCourse.courseCode} result`}
                style={styles.modalAction}
              >
                <Share2 size={17} color="#FFFFFF" />
                <Text style={styles.modalActionText}>Share Course Result</Text>
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
  heroHeadingRow: { flexDirection: 'row', alignItems: 'center' },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,171,0,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,171,0,0.38)',
  },
  heroHeadingCopy: { flex: 1, marginLeft: 12, marginRight: 8 },
  eyebrow: { color: '#FFAB00', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 2 },
  heroSubtitle: { color: '#CBD5E1', fontSize: 12, fontWeight: '600', marginTop: 2 },
  gpaRow: {
    flexDirection: 'row',
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  gpaPrimary: { flex: 1 },
  gpaSecondary: { flex: 0.82, paddingLeft: 18, justifyContent: 'center' },
  heroDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.14)' },
  gpaLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  gpaValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 3 },
  gpaValue: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  gpaOutOf: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  honoursRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  honoursText: { color: '#FDE68A', fontSize: 11, fontWeight: '700' },
  semesterGpa: { color: '#34D399', fontSize: 27, fontWeight: '900', marginTop: 5 },
  creditText: { color: '#CBD5E1', fontSize: 11, fontWeight: '600', marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: { color: '#64748B', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  semesterList: { gap: 9, paddingTop: 9, paddingBottom: 4 },
  semesterButton: {
    minWidth: 132,
    minHeight: 58,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  semesterButtonSelected: { backgroundColor: '#002147', borderColor: '#002147' },
  semesterButtonTitle: { color: '#1E293B', fontSize: 13, fontWeight: '800' },
  semesterButtonTitleSelected: { color: '#FFFFFF' },
  semesterButtonMeta: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 },
  semesterButtonMetaSelected: { color: '#CBD5E1' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 24 },
  actionButton: {
    minHeight: 48,
    flex: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonPrimary: { backgroundColor: '#00875A' },
  actionButtonSecondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1' },
  actionButtonPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  actionButtonSecondaryText: { color: '#002147', fontSize: 13, fontWeight: '800' },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#002147', fontSize: 17, fontWeight: '900' },
  sectionSubtitle: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  completionText: { color: '#047857', fontSize: 10, fontWeight: '800' },
  coursePressable: { marginBottom: 11 },
  courseCard: { padding: 14 },
  courseTopRow: { flexDirection: 'row', alignItems: 'center' },
  courseIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseCopy: { flex: 1, marginLeft: 11, marginRight: 8 },
  courseCode: { color: '#00875A', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  courseName: { color: '#0F172A', fontSize: 13, fontWeight: '800', marginTop: 1 },
  courseCredits: { color: '#94A3B8', fontSize: 10, fontWeight: '600', marginTop: 2 },
  letterGrade: {
    minWidth: 42,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  letterGradeText: { fontSize: 14, fontWeight: '900' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, marginBottom: 6 },
  scoreLabel: { color: '#64748B', fontSize: 10, fontWeight: '700' },
  scoreValue: { color: '#002147', fontSize: 11, fontWeight: '900' },
  progressTrack: { height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00875A', borderRadius: 3 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 15,
    padding: 14,
    marginTop: 5,
  },
  noticeText: { flex: 1, color: '#475569', fontSize: 11, lineHeight: 17, fontWeight: '600' },
  modalRoot: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.62)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  modalHeaderCopy: { flex: 1, paddingRight: 12 },
  modalEyebrow: { color: '#00875A', fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
  modalTitle: { color: '#0F172A', fontSize: 18, fontWeight: '900', marginTop: 3 },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#002147',
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },
  modalResultLabel: { color: '#94A3B8', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  modalResultScore: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 1 },
  modalGradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  modalGradeLabel: { color: '#94A3B8', fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  modalGradeValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', marginTop: 1 },
  breakdownTitle: { color: '#002147', fontSize: 13, fontWeight: '900', marginTop: 20, marginBottom: 8 },
  assessmentRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  assessmentLabel: { color: '#475569', fontSize: 12, fontWeight: '700' },
  assessmentScorePill: { backgroundColor: '#F1F5F9', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  assessmentScore: { color: '#0F172A', fontSize: 12, fontWeight: '900' },
  modalAction: {
    minHeight: 50,
    backgroundColor: '#00875A',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  modalActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
});

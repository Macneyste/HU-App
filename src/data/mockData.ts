/**
 * ─────────────────────────────────────────────────────────────
 *  Hormuud University — Mock Data Layer
 *  Realistic seed data for every module. In production these
 *  would come from TanStack Query → Axios → REST API.
 * ─────────────────────────────────────────────────────────────
 */

import type {
  User,
  Course,
  ScheduleSlot,
  Grade,
  SemesterGrades,
  Payment,
  FinanceSummary,
  DashboardStats,
  NextClassInfo,
  StudentIdCard,
  ActionItem,
  Announcement,
} from '../types';

// ─── Current Student ──────────────────────────────────────────

export const MOCK_USER: User = {
  id: 'usr_001',
  studentId: 'HU-4982',
  fullName: 'Yonis Abdi',
  email: 'yonis.abdi@students.hu.edu.so',
  phone: '+252 61 234 5678',
  avatar: 'https://api.dicebear.com/7.x/notionists/png?seed=yonis&backgroundColor=c0aede',
  role: 'student',
  faculty: 'Faculty of Computer Science',
  program: 'BSc. Computer Science',
  yearOfStudy: 3,
  semester: 6,
  enrollmentDate: '2024-09-01',
  isActive: true,
};

// ─── Courses ──────────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_001',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    instructor: 'Prof. Abdullahi Mohamud',
    creditHours: 4,
    room: 'Room 204',
    building: 'Block A',
    semester: 6,
    year: 2026,
    attendancePercentage: 96,
    color: '#002147',
  },
  {
    id: 'crs_002',
    code: 'CS312',
    name: 'Database Management Systems',
    instructor: 'Dr. Fadumo Hassan',
    creditHours: 3,
    room: 'Lab 102',
    building: 'ICT Centre',
    semester: 6,
    year: 2026,
    attendancePercentage: 92,
    color: '#00875A',
  },
  {
    id: 'crs_003',
    code: 'CS305',
    name: 'Software Engineering',
    instructor: 'Dr. Ahmed Yusuf',
    creditHours: 3,
    room: 'Room 310',
    building: 'Block B',
    semester: 6,
    year: 2026,
    attendancePercentage: 88,
    color: '#6C5CE7',
  },
  {
    id: 'crs_004',
    code: 'CS318',
    name: 'Computer Networks',
    instructor: 'Prof. Halima Osman',
    creditHours: 3,
    room: 'Room 108',
    building: 'Block A',
    semester: 6,
    year: 2026,
    attendancePercentage: 94,
    color: '#E17055',
  },
  {
    id: 'crs_005',
    code: 'IS201',
    name: 'Islamic Studies III',
    instructor: 'Sheikh Mohamed Ali',
    creditHours: 2,
    room: 'Hall 01',
    building: 'Main Hall',
    semester: 6,
    year: 2026,
    attendancePercentage: 100,
    color: '#FDCB6E',
  },
  {
    id: 'crs_006',
    code: 'MTH302',
    name: 'Discrete Mathematics',
    instructor: 'Dr. Nasra Ibrahim',
    creditHours: 3,
    room: 'Room 215',
    building: 'Block A',
    semester: 6,
    year: 2026,
    attendancePercentage: 90,
    color: '#0984E3',
  },
];

// ─── Weekly Schedule ──────────────────────────────────────────

export const MOCK_SCHEDULE: ScheduleSlot[] = [
  // Saturday
  {
    id: 'sch_001', courseId: 'crs_001', courseName: 'Data Structures & Algorithms',
    courseCode: 'CS301', instructor: 'Prof. Abdullahi Mohamud',
    room: 'Room 204', building: 'Block A', dayOfWeek: 'Saturday',
    startTime: '08:00', endTime: '09:30', type: 'lecture', color: '#002147',
  },
  {
    id: 'sch_002', courseId: 'crs_002', courseName: 'Database Management Systems',
    courseCode: 'CS312', instructor: 'Dr. Fadumo Hassan',
    room: 'Lab 102', building: 'ICT Centre', dayOfWeek: 'Saturday',
    startTime: '10:00', endTime: '11:30', type: 'lab', color: '#00875A',
  },
  {
    id: 'sch_003', courseId: 'crs_005', courseName: 'Islamic Studies III',
    courseCode: 'IS201', instructor: 'Sheikh Mohamed Ali',
    room: 'Hall 01', building: 'Main Hall', dayOfWeek: 'Saturday',
    startTime: '14:00', endTime: '15:00', type: 'lecture', color: '#FDCB6E',
  },
  // Sunday
  {
    id: 'sch_004', courseId: 'crs_003', courseName: 'Software Engineering',
    courseCode: 'CS305', instructor: 'Dr. Ahmed Yusuf',
    room: 'Room 310', building: 'Block B', dayOfWeek: 'Sunday',
    startTime: '08:00', endTime: '09:30', type: 'lecture', color: '#6C5CE7',
  },
  {
    id: 'sch_005', courseId: 'crs_004', courseName: 'Computer Networks',
    courseCode: 'CS318', instructor: 'Prof. Halima Osman',
    room: 'Room 108', building: 'Block A', dayOfWeek: 'Sunday',
    startTime: '10:00', endTime: '11:30', type: 'lecture', color: '#E17055',
  },
  {
    id: 'sch_006', courseId: 'crs_006', courseName: 'Discrete Mathematics',
    courseCode: 'MTH302', instructor: 'Dr. Nasra Ibrahim',
    room: 'Room 215', building: 'Block A', dayOfWeek: 'Sunday',
    startTime: '13:00', endTime: '14:30', type: 'lecture', color: '#0984E3',
  },
  // Monday
  {
    id: 'sch_007', courseId: 'crs_001', courseName: 'Data Structures & Algorithms',
    courseCode: 'CS301', instructor: 'Prof. Abdullahi Mohamud',
    room: 'Lab 102', building: 'ICT Centre', dayOfWeek: 'Monday',
    startTime: '08:00', endTime: '10:00', type: 'lab', color: '#002147',
  },
  {
    id: 'sch_008', courseId: 'crs_002', courseName: 'Database Management Systems',
    courseCode: 'CS312', instructor: 'Dr. Fadumo Hassan',
    room: 'Room 204', building: 'Block A', dayOfWeek: 'Monday',
    startTime: '10:30', endTime: '12:00', type: 'lecture', color: '#00875A',
  },
  // Tuesday
  {
    id: 'sch_009', courseId: 'crs_003', courseName: 'Software Engineering',
    courseCode: 'CS305', instructor: 'Dr. Ahmed Yusuf',
    room: 'Lab 102', building: 'ICT Centre', dayOfWeek: 'Tuesday',
    startTime: '09:00', endTime: '11:00', type: 'lab', color: '#6C5CE7',
  },
  {
    id: 'sch_010', courseId: 'crs_004', courseName: 'Computer Networks',
    courseCode: 'CS318', instructor: 'Prof. Halima Osman',
    room: 'Room 108', building: 'Block A', dayOfWeek: 'Tuesday',
    startTime: '13:00', endTime: '14:30', type: 'lecture', color: '#E17055',
  },
  // Wednesday
  {
    id: 'sch_011', courseId: 'crs_006', courseName: 'Discrete Mathematics',
    courseCode: 'MTH302', instructor: 'Dr. Nasra Ibrahim',
    room: 'Room 215', building: 'Block A', dayOfWeek: 'Wednesday',
    startTime: '08:00', endTime: '09:30', type: 'tutorial', color: '#0984E3',
  },
  {
    id: 'sch_012', courseId: 'crs_001', courseName: 'Data Structures & Algorithms',
    courseCode: 'CS301', instructor: 'Prof. Abdullahi Mohamud',
    room: 'Room 204', building: 'Block A', dayOfWeek: 'Wednesday',
    startTime: '10:00', endTime: '11:30', type: 'lecture', color: '#002147',
  },
  {
    id: 'sch_013', courseId: 'crs_005', courseName: 'Islamic Studies III',
    courseCode: 'IS201', instructor: 'Sheikh Mohamed Ali',
    room: 'Hall 01', building: 'Main Hall', dayOfWeek: 'Wednesday',
    startTime: '14:00', endTime: '15:00', type: 'lecture', color: '#FDCB6E',
  },
  // Thursday
  {
    id: 'sch_014', courseId: 'crs_002', courseName: 'Database Management Systems',
    courseCode: 'CS312', instructor: 'Dr. Fadumo Hassan',
    room: 'Lab 102', building: 'ICT Centre', dayOfWeek: 'Thursday',
    startTime: '08:00', endTime: '10:00', type: 'lab', color: '#00875A',
  },
  {
    id: 'sch_015', courseId: 'crs_004', courseName: 'Computer Networks',
    courseCode: 'CS318', instructor: 'Prof. Halima Osman',
    room: 'Lab 103', building: 'ICT Centre', dayOfWeek: 'Thursday',
    startTime: '10:30', endTime: '12:30', type: 'lab', color: '#E17055',
  },
];

// ─── Grades ───────────────────────────────────────────────────

export const MOCK_SEMESTER_GRADES: SemesterGrades[] = [
  {
    semester: 6,
    year: 2026,
    label: 'Spring 2026 (Current)',
    courses: [
      { courseId: 'crs_001', courseCode: 'CS301', courseName: 'Data Structures & Algorithms', creditHours: 4, assignment: 18, midterm: 27, finalExam: 44, total: 89, letterGrade: 'A', gradePoint: 4.0 },
      { courseId: 'crs_002', courseCode: 'CS312', courseName: 'Database Management Systems', creditHours: 3, assignment: 17, midterm: 25, finalExam: 40, total: 82, letterGrade: 'B+', gradePoint: 3.3 },
      { courseId: 'crs_003', courseCode: 'CS305', courseName: 'Software Engineering', creditHours: 3, assignment: 19, midterm: 28, finalExam: 46, total: 93, letterGrade: 'A+', gradePoint: 4.0 },
      { courseId: 'crs_004', courseCode: 'CS318', courseName: 'Computer Networks', creditHours: 3, assignment: 16, midterm: 24, finalExam: 38, total: 78, letterGrade: 'B', gradePoint: 3.0 },
      { courseId: 'crs_005', courseCode: 'IS201', courseName: 'Islamic Studies III', creditHours: 2, assignment: 19, midterm: 29, finalExam: 47, total: 95, letterGrade: 'A+', gradePoint: 4.0 },
      { courseId: 'crs_006', courseCode: 'MTH302', courseName: 'Discrete Mathematics', creditHours: 3, assignment: 18, midterm: 26, finalExam: 42, total: 86, letterGrade: 'A-', gradePoint: 3.7 },
    ],
    semesterGPA: 3.68,
    cumulativeGPA: 3.80,
    totalCredits: 18,
    earnedCredits: 18,
  },
  {
    semester: 5,
    year: 2025,
    label: 'Fall 2025',
    courses: [
      { courseId: 'c_prev_1', courseCode: 'CS290', courseName: 'Operating Systems', creditHours: 4, assignment: 19, midterm: 28, finalExam: 45, total: 92, letterGrade: 'A+', gradePoint: 4.0 },
      { courseId: 'c_prev_2', courseCode: 'CS280', courseName: 'Object-Oriented Programming', creditHours: 3, assignment: 18, midterm: 27, finalExam: 43, total: 88, letterGrade: 'A', gradePoint: 4.0 },
      { courseId: 'c_prev_3', courseCode: 'CS270', courseName: 'Web Development', creditHours: 3, assignment: 17, midterm: 26, finalExam: 41, total: 84, letterGrade: 'B+', gradePoint: 3.3 },
      { courseId: 'c_prev_4', courseCode: 'MTH250', courseName: 'Linear Algebra', creditHours: 3, assignment: 19, midterm: 29, finalExam: 46, total: 94, letterGrade: 'A+', gradePoint: 4.0 },
      { courseId: 'c_prev_5', courseCode: 'ENG201', courseName: 'Academic English III', creditHours: 2, assignment: 16, midterm: 25, finalExam: 39, total: 80, letterGrade: 'B+', gradePoint: 3.3 },
    ],
    semesterGPA: 3.76,
    cumulativeGPA: 3.82,
    totalCredits: 15,
    earnedCredits: 15,
  },
];

// ─── Finance ──────────────────────────────────────────────────

export const MOCK_FINANCE: FinanceSummary = {
  totalTuition: 2400,
  amountPaid: 1800,
  remainingBalance: 600,
  currency: 'USD',
  scholarshipDiscount: 0,
  nextDueDate: '2026-10-15',
  payments: [
    { id: 'pay_001', description: 'Tuition Fee — Semester 6 (1st Installment)', amount: 1200, paidAmount: 1200, dueDate: '2026-09-01', paidDate: '2026-08-28', status: 'completed', method: 'evc_plus', referenceNumber: 'EVC-20260828-4982' },
    { id: 'pay_002', description: 'Tuition Fee — Semester 6 (2nd Installment)', amount: 600, paidAmount: 600, dueDate: '2026-09-15', paidDate: '2026-09-12', status: 'completed', method: 'zaad', referenceNumber: 'ZAD-20260912-4982' },
    { id: 'pay_003', description: 'Tuition Fee — Semester 6 (3rd Installment)', amount: 600, paidAmount: 0, dueDate: '2026-10-15', paidDate: null, status: 'pending', method: null, referenceNumber: null },
  ],
};

// ─── Dashboard Stats ──────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  currentGPA: 3.80,
  maxGPA: 4.0,
  attendanceRate: 94,
  enrolledCredits: 18,
  completedCredits: 75,
  totalRequiredCredits: 132,
};

// ─── Next Class (for countdown widget) ────────────────────────

export const getNextClassInfo = (): NextClassInfo => {
  // In production, compute from schedule vs current time
  const now = new Date();
  const nextStart = new Date(now);
  nextStart.setHours(nextStart.getHours() + 1, 30, 0, 0); // 1.5 hrs from now
  const nextEnd = new Date(nextStart);
  nextEnd.setHours(nextEnd.getHours() + 1, 30, 0, 0);

  return {
    courseId: 'crs_001',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS301',
    instructor: 'Prof. Abdullahi Mohamud',
    room: 'Room 204',
    building: 'Block A',
    startTime: nextStart.toISOString(),
    endTime: nextEnd.toISOString(),
    type: 'lecture',
    color: '#002147',
  };
};

// ─── Student ID Card ──────────────────────────────────────────

export const MOCK_STUDENT_ID_CARD: StudentIdCard = {
  studentId: 'HU-4982',
  fullName: 'Yonis Abdi',
  faculty: 'Faculty of Computer Science',
  program: 'BSc. Computer Science',
  photo: 'https://api.dicebear.com/7.x/notionists/png?seed=yonis&backgroundColor=c0aede',
  issueDate: '2024-09-01',
  expiryDate: '2028-08-31',
  qrData: JSON.stringify({
    id: 'HU-4982',
    name: 'Yonis Abdi',
    faculty: 'CS',
    valid: '2028-08-31',
    type: 'student',
    institution: 'Hormuud University',
  }),
  barcode: '4982026090100',
};

// ─── Dashboard Action Grid ───────────────────────────────────

export const MOCK_ACTION_ITEMS: ActionItem[] = [
  { id: 'act_grades',    label: 'Grades',       icon: 'GraduationCap', route: '/(drawer)/grades',    color: '#002147' },
  { id: 'act_tuition',   label: 'Tuition Fees', icon: 'Wallet',        route: '/(drawer)/(tabs)/finance', color: '#00875A' },
  { id: 'act_library',   label: 'E-Library',    icon: 'BookOpen',      route: '/(drawer)/library',   color: '#6C5CE7' },
  { id: 'act_news',      label: 'News',         icon: 'Newspaper',     route: '/(drawer)/news',      color: '#E17055' },
  { id: 'act_exam',      label: 'Exam Card',    icon: 'FileCheck',     route: '/(drawer)/exam-card', color: '#0984E3' },
  { id: 'act_id',        label: 'Student ID',   icon: 'IdCard',        route: '/(drawer)/id-card',   color: '#FFAB00' },
];

// ─── Announcements ────────────────────────────────────────────

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_001',
    title: 'Midterm Examinations Schedule Released',
    summary: 'The midterm examination schedule for Semester 6 is now available on the student portal.',
    content: 'The midterm examination schedule for Semester 6 (Spring 2026) has been finalized and published...',
    imageUrl: null,
    publishedAt: '2026-09-01T10:00:00Z',
    category: 'academic',
    isRead: false,
  },
  {
    id: 'ann_002',
    title: 'HU Annual Innovation Fair 2026',
    summary: 'Join us for the annual innovation fair showcasing student projects from all faculties.',
    content: 'Hormuud University invites all students and faculty to the Annual Innovation Fair...',
    imageUrl: null,
    publishedAt: '2026-08-28T08:00:00Z',
    category: 'event',
    isRead: true,
  },
  {
    id: 'ann_003',
    title: 'Library Extended Hours — Exam Season',
    summary: 'The Ocean of Knowledge Library will operate extended hours during the exam period.',
    content: 'Starting October 1st, the library will be open from 7:00 AM to 11:00 PM daily...',
    imageUrl: null,
    publishedAt: '2026-08-25T14:00:00Z',
    category: 'general',
    isRead: true,
  },
];

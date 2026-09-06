/**
 * ─────────────────────────────────────────────────────────────
 *  Hormuud University — Core Type Definitions
 *  Strict TypeScript interfaces for every domain entity.
 *  No `any` types allowed.
 * ─────────────────────────────────────────────────────────────
 */

// ─── Authentication & User ────────────────────────────────────

/** Supported portal roles across the university. */
export type UserRole =
  | 'student'
  | 'lecturer'
  | 'registrar'
  | 'finance'
  | 'hr'
  | 'public_relations'
  | 'student_affairs'
  | 'events'
  | 'postgraduate'
  | 'examinations'
  | 'ict'
  | 'research'
  | 'admin';

export type PortalModule =
  | 'dashboard'
  | 'schedule'
  | 'finance'
  | 'grades'
  | 'exams'
  | 'digitalId'
  | 'library'
  | 'news'
  | 'admissions'
  | 'studentRecords'
  | 'staff'
  | 'studentAffairs'
  | 'events'
  | 'postgraduate'
  | 'ict'
  | 'research'
  | 'directory'
  | 'accessControl'
  | 'system';

export type AccessLevel = 'view' | 'manage';

/** Core user profile shared across all roles */
export interface User {
  id: string;
  accountId: string;
  studentId: string;           // Empty for non-student roles.
  fullName: string;
  email: string;
  phone: string;
  avatar: string;              // URI to profile photo
  role: UserRole;
  department: string;
  jobTitle: string;
  faculty: string;
  program: string;
  yearOfStudy: number;
  semester: number;
  enrollmentDate: string;      // ISO date string
  isActive: boolean;
}

/** Authentication state persisted in secure storage */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  rememberMe: boolean;
  sessionExpiresAt: string | null;
  lastAuthenticatedAt: string | null;
}

/** Login request payload */
export interface LoginCredentials {
  identifier: string;          // Student ID or email
  password: string;
  rememberMe: boolean;
}

/** Login API response */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Academic — Courses ───────────────────────────────────────

/** Days on which classes occur (Sat-Thu, Somali academic week) */
export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

/** Type of academic session */
export type SessionType = 'lecture' | 'lab' | 'tutorial' | 'exam';

/** A single enrolled course */
export interface Course {
  id: string;
  code: string;                // e.g. "CS301"
  name: string;                // e.g. "Data Structures & Algorithms"
  instructor: string;
  creditHours: number;
  room: string;                // e.g. "Room 204"
  building: string;            // e.g. "Block A"
  semester: number;
  year: number;
  attendancePercentage: number; // 0-100
  color: string;               // Hex for UI accent per course
}

// ─── Academic — Schedule / Timetable ──────────────────────────

/** A single time-slot in the weekly timetable */
export interface ScheduleSlot {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  room: string;
  building: string;
  dayOfWeek: DayOfWeek;
  startTime: string;           // "08:00"
  endTime: string;             // "09:30"
  type: SessionType;
  color: string;
}

// ─── Academic — Grades & Transcript ───────────────────────────

/** Marks breakdown for a single course */
export interface Grade {
  courseId: string;
  courseCode: string;
  courseName: string;
  creditHours: number;
  assignment: number;          // out of 20
  midterm: number;             // out of 30
  finalExam: number;           // out of 50
  total: number;               // out of 100
  letterGrade: string;         // "A+", "A", "B+", etc.
  gradePoint: number;          // 4.0, 3.7, 3.3, etc.
}

/** Grades grouped by semester */
export interface SemesterGrades {
  semester: number;
  year: number;
  label: string;               // "Fall 2025"
  courses: Grade[];
  semesterGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
  earnedCredits: number;
}

// ─── Finance & Payments ───────────────────────────────────────

/** Supported Somali mobile money payment methods */
export type PaymentMethod = 'evc_plus' | 'sahal' | 'zaad';

/** Status of a payment transaction */
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

/** A single payment record */
export interface Payment {
  id: string;
  description: string;         // e.g. "Tuition Fee — Semester 6"
  amount: number;              // in USD
  paidAmount: number;
  dueDate: string;             // ISO date string
  paidDate: string | null;
  status: PaymentStatus;
  method: PaymentMethod | null;
  referenceNumber: string | null;
}

/** Summary of a student's financial standing */
export interface FinanceSummary {
  totalTuition: number;
  amountPaid: number;
  remainingBalance: number;
  currency: string;            // "USD"
  payments: Payment[];
  nextDueDate: string;
  scholarshipDiscount: number; // percentage, 0-100
}

// ─── Digital Student ID Card ──────────────────────────────────

/** Data encoded in the QR code on the student ID */
export interface StudentIdCard {
  studentId: string;
  fullName: string;
  faculty: string;
  program: string;
  photo: string;               // URI
  issueDate: string;
  expiryDate: string;
  qrData: string;              // JSON-encoded string for QR scanning
  barcode: string;             // numeric barcode value
}

// ─── Dashboard Widgets ────────────────────────────────────────

/** Aggregated stats for the home dashboard */
export interface DashboardStats {
  currentGPA: number;
  maxGPA: number;
  attendanceRate: number;      // percentage
  enrolledCredits: number;
  completedCredits: number;
  totalRequiredCredits: number;
}

/** Next upcoming class info for the countdown widget */
export interface NextClassInfo {
  courseId: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  room: string;
  building: string;
  startTime: string;           // ISO datetime
  endTime: string;
  type: SessionType;
  color: string;
}

// ─── News / Announcements ─────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
  category: 'academic' | 'event' | 'general' | 'urgent';
  isRead: boolean;
}

// ─── Navigation & UI ──────────────────────────────────────────

/** Quick-action items on the dashboard grid */
export interface ActionItem {
  id: string;
  label: string;
  icon: string;                // Lucide icon name
  route: string;               // Expo Router path
  color: string;
  badge?: number;
}

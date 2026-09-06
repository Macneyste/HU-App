import type { AccessLevel, PortalModule, User, UserRole } from '../types';

export interface PortalModuleDefinition {
  id: PortalModule;
  label: string;
  description: string;
}

export const PORTAL_MODULES: PortalModuleDefinition[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Role overview, notices, and key activity.' },
  { id: 'schedule', label: 'Academic Schedule', description: 'Classes, rooms, teaching schedules, and timetable operations.' },
  { id: 'finance', label: 'Finance & Payments', description: 'Fees, billing, receipts, balances, and financial clearance.' },
  { id: 'grades', label: 'Grades & Results', description: 'Academic results, assessment records, and transcripts.' },
  { id: 'exams', label: 'Examinations', description: 'Exam cards, schedules, regulations, and assessment workflows.' },
  { id: 'digitalId', label: 'Digital Identity', description: 'Student identity cards and institutional verification.' },
  { id: 'library', label: 'Library', description: 'Digital resources, borrowing, catalogues, and research material.' },
  { id: 'news', label: 'News & Announcements', description: 'Official university communication and published updates.' },
  { id: 'admissions', label: 'Admissions', description: 'Applications, admission decisions, and enrollment intake.' },
  { id: 'studentRecords', label: 'Student Records', description: 'Registration, transcripts, status, and academic records.' },
  { id: 'staff', label: 'Staff & HR', description: 'Staff records, recruitment, contracts, leave, and benefits.' },
  { id: 'studentAffairs', label: 'Student Affairs', description: 'Welfare, counselling, engagement, conduct, and support.' },
  { id: 'events', label: 'Events & Conferences', description: 'Conferences, workshops, seminars, and event logistics.' },
  { id: 'postgraduate', label: 'Postgraduate Studies', description: 'Graduate admission, progression, supervision, and theses.' },
  { id: 'ict', label: 'ICT Support', description: 'Accounts, systems, e-learning, support, and connectivity.' },
  { id: 'research', label: 'Research Center', description: 'Proposals, ethics, publications, and collaboration.' },
  { id: 'directory', label: 'University Directory', description: 'Official HU office contacts and service responsibilities.' },
  { id: 'accessControl', label: 'Access Center', description: 'A transparent view of role permissions and restrictions.' },
  { id: 'system', label: 'System Administration', description: 'Users, roles, security, configuration, and audit operations.' },
];

export interface RoleDefinition {
  role: UserRole;
  label: string;
  shortLabel: string;
  department: string;
  description: string;
  demoName: string;
  demoEmail: string;
  demoPassword: string;
  modules: Partial<Record<PortalModule, AccessLevel>>;
}

const sharedAccess = {
  dashboard: 'view',
  news: 'view',
  directory: 'view',
  accessControl: 'view',
} as const;

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  student: {
    role: 'student',
    label: 'Student',
    shortLabel: 'Student',
    department: 'Faculty of Computer Science & IT',
    description: 'Personal academic records, schedule, finance, exams, identity, and learning resources.',
    demoName: 'Yonis Abdi',
    demoEmail: 'student@demo.hu.edu.so',
    demoPassword: 'HU.Student!2026',
    modules: { ...sharedAccess, schedule: 'view', finance: 'view', grades: 'view', exams: 'view', digitalId: 'view', library: 'view' },
  },
  lecturer: {
    role: 'lecturer',
    label: 'Lecturer',
    shortLabel: 'Faculty',
    department: 'Academic Affairs',
    description: 'Teaching schedules, class assessment, results, learning resources, and research services.',
    demoName: 'Dr. Abdullahi Mohamud',
    demoEmail: 'lecturer@demo.hu.edu.so',
    demoPassword: 'HU.Lecturer!2026',
    modules: { ...sharedAccess, schedule: 'manage', grades: 'manage', exams: 'view', library: 'view', research: 'manage', studentRecords: 'view' },
  },
  registrar: {
    role: 'registrar',
    label: 'Admissions & Registrar',
    shortLabel: 'Registrar',
    department: 'Admissions & Registrar Office',
    description: 'Admissions, enrollment, student records, transcripts, identity, and academic verification.',
    demoName: 'Amina Hassan',
    demoEmail: 'registrar@demo.hu.edu.so',
    demoPassword: 'HU.Registrar!2026',
    modules: { ...sharedAccess, admissions: 'manage', studentRecords: 'manage', grades: 'view', exams: 'manage', digitalId: 'manage', schedule: 'view' },
  },
  finance: {
    role: 'finance',
    label: 'Finance Officer',
    shortLabel: 'Finance',
    department: 'Finance Office',
    description: 'Tuition, billing, receipts, balances, refunds, and financial clearance.',
    demoName: 'Mohamed Ali',
    demoEmail: 'finance@demo.hu.edu.so',
    demoPassword: 'HU.Finance!2026',
    modules: { ...sharedAccess, finance: 'manage', studentRecords: 'view' },
  },
  hr: {
    role: 'hr',
    label: 'Human Resources',
    shortLabel: 'HR',
    department: 'Human Resources Office',
    description: 'Recruitment, staff records, contracts, leave, benefits, and personnel policy.',
    demoName: 'Sahra Ahmed',
    demoEmail: 'hr@demo.hu.edu.so',
    demoPassword: 'HU.HR!2026',
    modules: { ...sharedAccess, staff: 'manage' },
  },
  public_relations: {
    role: 'public_relations',
    label: 'Public Relations',
    shortLabel: 'PR',
    department: 'Public Relations Office',
    description: 'Official news, media, brand communication, publicity, and external relations.',
    demoName: 'Abdi Noor',
    demoEmail: 'pr@demo.hu.edu.so',
    demoPassword: 'HU.PR!2026',
    modules: { ...sharedAccess, news: 'manage', events: 'manage' },
  },
  student_affairs: {
    role: 'student_affairs',
    label: 'Student Affairs',
    shortLabel: 'Student Affairs',
    department: 'Student Affairs Office',
    description: 'Student welfare, counselling, engagement, conduct, complaints, and support.',
    demoName: 'Hodan Warsame',
    demoEmail: 'student.affairs@demo.hu.edu.so',
    demoPassword: 'HU.Affairs!2026',
    modules: { ...sharedAccess, studentAffairs: 'manage', events: 'view', studentRecords: 'view' },
  },
  events: {
    role: 'events',
    label: 'Conference & Events',
    shortLabel: 'Events',
    department: 'Conference & Events Office',
    description: 'Academic conferences, workshops, seminars, registration, and event logistics.',
    demoName: 'Fadumo Nur',
    demoEmail: 'events@demo.hu.edu.so',
    demoPassword: 'HU.Events!2026',
    modules: { ...sharedAccess, events: 'manage', news: 'manage' },
  },
  postgraduate: {
    role: 'postgraduate',
    label: 'Postgraduate Studies',
    shortLabel: 'Postgraduate',
    department: 'Centre for Postgraduate Studies',
    description: 'Graduate admissions, supervision, thesis workflows, progression, and completion.',
    demoName: 'Dr. Ismail Omar',
    demoEmail: 'postgraduate@demo.hu.edu.so',
    demoPassword: 'HU.Postgrad!2026',
    modules: { ...sharedAccess, postgraduate: 'manage', admissions: 'view', research: 'view', grades: 'view', studentRecords: 'view' },
  },
  examinations: {
    role: 'examinations',
    label: 'Examinations Officer',
    shortLabel: 'Exams',
    department: 'Examinations Office',
    description: 'Exam scheduling, assessment controls, results publication, appeals, and exam cards.',
    demoName: 'Abdirahman Yusuf',
    demoEmail: 'exams@demo.hu.edu.so',
    demoPassword: 'HU.Exams!2026',
    modules: { ...sharedAccess, exams: 'manage', grades: 'manage', schedule: 'manage', studentRecords: 'view' },
  },
  ict: {
    role: 'ict',
    label: 'ICT Support',
    shortLabel: 'ICT',
    department: 'ICT & Technical Support Office',
    description: 'Accounts, platforms, e-learning, technical support, systems, and connectivity.',
    demoName: 'Eng. Ahmed Said',
    demoEmail: 'ict@demo.hu.edu.so',
    demoPassword: 'HU.ICT!2026',
    modules: { ...sharedAccess, ict: 'manage', system: 'view' },
  },
  research: {
    role: 'research',
    label: 'Research Center',
    shortLabel: 'Research',
    department: 'Hormuud University Research Center',
    description: 'Research proposals, ethics, publications, institutional research, and partnerships.',
    demoName: 'Dr. Maryan Osman',
    demoEmail: 'research@demo.hu.edu.so',
    demoPassword: 'HU.Research!2026',
    modules: { ...sharedAccess, research: 'manage', library: 'view', postgraduate: 'view' },
  },
  admin: {
    role: 'admin',
    label: 'System Administrator',
    shortLabel: 'Admin',
    department: 'University Administration',
    description: 'Institution-wide configuration, users, security, permissions, audit, and all portal modules.',
    demoName: 'HU System Admin',
    demoEmail: 'admin@demo.hu.edu.so',
    demoPassword: 'HU.Admin!2026',
    modules: Object.fromEntries(PORTAL_MODULES.map((module) => [module.id, 'manage'])) as Record<PortalModule, AccessLevel>,
  },
};

export const DEMO_ROLE_ORDER: UserRole[] = [
  'student', 'lecturer', 'registrar', 'finance', 'hr', 'public_relations',
  'student_affairs', 'events', 'postgraduate', 'examinations', 'ict', 'research', 'admin',
];

export function getRoleDefinition(role: UserRole) {
  return ROLE_DEFINITIONS[role];
}

export function hasModuleAccess(
  role: UserRole,
  module: PortalModule,
  requiredLevel: AccessLevel = 'view',
) {
  const level = ROLE_DEFINITIONS[role].modules[module];
  if (!level) return false;
  return requiredLevel === 'view' || level === 'manage';
}

export function getModuleAccess(role: UserRole, module: PortalModule) {
  return ROLE_DEFINITIONS[role].modules[module] ?? null;
}

export function findDemoRole(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  return DEMO_ROLE_ORDER.find((role) => {
    const definition = ROLE_DEFINITIONS[role];
    return normalized === definition.demoEmail.toLowerCase();
  }) ?? null;
}

export function verifyDemoPassword(role: UserRole, password: string) {
  const expected = ROLE_DEFINITIONS[role].demoPassword;
  const length = Math.max(expected.length, password.length);
  let mismatch = expected.length ^ password.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (expected.charCodeAt(index) || 0) ^ (password.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

export function buildDemoUser(role: UserRole): User {
  const definition = ROLE_DEFINITIONS[role];
  const isStudent = role === 'student';
  const isLecturer = role === 'lecturer';

  return {
    id: `demo-${role}`,
    accountId: isStudent ? 'HU-4982' : `HU-${role.replace(/_/g, '-').toUpperCase()}-01`,
    studentId: isStudent ? 'HU-4982' : '',
    fullName: definition.demoName,
    email: definition.demoEmail,
    phone: '+252 61 3311119',
    avatar: '',
    role,
    department: definition.department,
    jobTitle: definition.label,
    faculty: isStudent || isLecturer ? 'Faculty of Computer Science & IT' : definition.department,
    program: isStudent ? 'BSc in Computer Science' : isLecturer ? 'Computer Science & IT' : definition.label,
    yearOfStudy: isStudent ? 3 : 0,
    semester: isStudent ? 6 : 0,
    enrollmentDate: isStudent ? '2023-09-01' : '2021-01-10',
    isActive: true,
  };
}

const routeModuleMap: Record<string, PortalModule> = {
  timetable: 'schedule',
  finance: 'finance',
  grades: 'grades',
  'exam-card': 'exams',
  'id-card': 'digitalId',
  library: 'library',
  news: 'news',
  directory: 'directory',
  access: 'accessControl',
};

export function getModuleForSegments(segments: string[]) {
  const route = [...segments].reverse().find((segment) => routeModuleMap[segment]);
  return route ? routeModuleMap[route] : null;
}

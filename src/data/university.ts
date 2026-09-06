import type { ImageSourcePropType } from 'react-native';

export const HORMUUD_UNIVERSITY = {
  name: 'Hormuud University',
  shortName: 'HU',
  tagline: 'Knowledge. Character. Purpose.',
  purpose: 'A brighter future for people, knowledge, and society.',
  description:
    'A private, non-profit university connecting academic study, values, research, and practical learning for Somalia.',
  vision:
    'To be a world-class university recognized for excellence in teaching, relevant research, and community service.',
  founded: 2010,
  facultyCount: 8,
  programmeCount: 40,
  campusCount: 3,
  website: 'https://hu.edu.so',
  studentPortal: 'https://portal.hu.edu.so',
  admissionsPortal: 'https://students.hu.edu.so/admission/home',
  email: 'info@hu.edu.so',
  phone: '+252 61 3311119',
  callCentre: '2060',
  address: 'Wadajir District, Mogadishu, Somalia',
} as const;

export interface FacultySummary {
  id: string;
  code: string;
  name: string;
  programmeCount: number;
  focus: string;
}

export const HU_FACULTIES: FacultySummary[] = [
  {
    id: 'engineering',
    code: 'ENG',
    name: 'Faculty of Engineering',
    programmeCount: 7,
    focus: 'Telecommunication, electrical, civil, mechanical, architecture, chemical, and biomedical engineering.',
  },
  {
    id: 'csit',
    code: 'CSIT',
    name: 'Faculty of Computer Science & IT',
    programmeCount: 7,
    focus: 'Computer science, IT, software engineering, data science, AI, cybersecurity, and IoT.',
  },
  {
    id: 'health',
    code: 'MHS',
    name: 'Faculty of Medicine & Health Sciences',
    programmeCount: 6,
    focus: 'Health education, clinical learning, public health, and community wellbeing.',
  },
  {
    id: 'economics',
    code: 'EMS',
    name: 'Faculty of Economics & Management',
    programmeCount: 6,
    focus: 'Economics, business, accounting, finance, management, and entrepreneurship.',
  },
  {
    id: 'geoscience',
    code: 'GEO',
    name: 'Faculty of Geosciences & Environment',
    programmeCount: 3,
    focus: 'Geoscience, environmental studies, and climate change.',
  },
  {
    id: 'arts',
    code: 'ASS',
    name: 'Faculty of Arts & Social Sciences',
    programmeCount: 6,
    focus: 'Communication, public relations, social sciences, education, and community development.',
  },
  {
    id: 'sharia',
    code: 'SL',
    name: 'Faculty of Sharia & Leadership',
    programmeCount: 1,
    focus: 'Islamic scholarship, ethical responsibility, and leadership.',
  },
  {
    id: 'agriculture',
    code: 'AGR',
    name: 'Faculty of Agriculture',
    programmeCount: 4,
    focus: 'Agronomy, plant protection, horticulture, and animal husbandry.',
  },
];

export interface UniversityOffice {
  id: string;
  name: string;
  email: string;
  responsibility: string;
}

export const HU_OFFICES: UniversityOffice[] = [
  { id: 'registrar', name: 'Admissions & Registrar', email: 'registrar@hu.edu.so', responsibility: 'Admissions, enrollment, records, transcripts, and verification.' },
  { id: 'finance', name: 'Finance Office', email: 'finance@hu.edu.so', responsibility: 'Tuition, billing, payments, clearance, receipts, and refunds.' },
  { id: 'hr', name: 'Human Resources', email: 'hrm@hu.edu.so', responsibility: 'Recruitment, staff records, contracts, leave, benefits, and policy.' },
  { id: 'pr', name: 'Public Relations', email: 'pr@hu.edu.so', responsibility: 'Announcements, media, university branding, events, and external relations.' },
  { id: 'student-affairs', name: 'Student Affairs', email: 'student.affairs@hu.edu.so', responsibility: 'Student welfare, counselling, engagement, conduct, and feedback.' },
  { id: 'events', name: 'Conference & Events', email: 'conference@hu.edu.so', responsibility: 'Conferences, workshops, seminars, registration, and event logistics.' },
  { id: 'skills', name: 'Skills Advancement Centre', email: 'husac@hu.edu.so', responsibility: 'Professional training, short courses, certification, and employability.' },
  { id: 'postgraduate', name: 'Postgraduate Studies', email: 'cps@hu.edu.so', responsibility: 'Graduate admissions, supervision, thesis, progression, and completion.' },
  { id: 'exams', name: 'Examinations Office', email: 'exam@hu.edu.so', responsibility: 'Exam schedules, regulations, results, appeals, and assessment support.' },
  { id: 'ict', name: 'ICT & Technical Support', email: 'ict@hu.edu.so', responsibility: 'Accounts, platforms, e-learning, technical support, and connectivity.' },
  { id: 'research', name: 'HU Research Center', email: 'hurc@hu.edu.so', responsibility: 'Research proposals, ethics, publications, collaboration, and coordination.' },
];

export const HU_ASSETS = {
  logo: require('../../assets/brand/hu-logo.png') as ImageSourcePropType,
  mark: require('../../assets/brand/hu-mark.png') as ImageSourcePropType,
  campus: require('../../assets/brand/campus.jpg') as ImageSourcePropType,
  students: require('../../assets/brand/students.jpg') as ImageSourcePropType,
  engineering: require('../../assets/brand/engineering.jpg') as ImageSourcePropType,
  library: require('../../assets/brand/library.jpg') as ImageSourcePropType,
  laboratory: require('../../assets/brand/laboratory.jpg') as ImageSourcePropType,
} as const;

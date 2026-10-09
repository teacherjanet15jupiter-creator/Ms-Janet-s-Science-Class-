export type Gender = 'M' | 'F';
export type House = 'Red' | 'Blue' | 'Green' | 'Yellow';
export type SkillLevel = 'Beginner' | 'Developing' | 'Proficient' | 'Advanced';

export type ScienceInterest =
  | 'Botany & Plant Cells'
  | 'Robotics & Automation'
  | 'Renewable Energy & Physics'
  | 'Chemistry & Solutions'
  | 'Space Exploration & Astronomy'
  | 'Ecology & Biodiversity';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export type UserRole = 'teacher' | 'student' | 'parent' | 'admin';

export type Language = 'en' | 'id' | 'zh' | 'es';

export interface Student {
  id: string; // e.g. "222050128"
  name: string;
  gender: Gender;
  house: House;
  musicInstrument: string;
  cca: string;
  skillLevel: SkillLevel;
  scienceInterest: ScienceInterest;
  attendance: AttendanceStatus;
  streakDays: number;
  xp: number;
  badges: string[];
  lockedToGroupId?: string | null;
  roleInTeam?: string; // e.g. "Lead Investigator", "Data Recorder", "Safety & Materials", "Communications"
  parentName?: string;
  parentEmail?: string;
  notes?: string;
  lastActiveDate?: string;
}

export interface StudentGroup {
  id: string;
  name: string; // e.g. "Team Chloroplast"
  topic?: ScienceInterest;
  students: Student[];
  leaderId?: string;
  notes?: string;
  rubricScore?: number;
  rubricGraded?: boolean;
}

export interface ClassRoom {
  id: string; // e.g. "p5-forgiveness"
  name: string; // "Primary 5 Forgiveness"
  gradeLevel: 5 | 6;
  formTeacher: string; // "Ms JANET MEJIA ABENOJA"
  room: string; // "A 402"
  isPriorityModule?: boolean; // Ms Janet's class!
  students: Student[];
  groups: StudentGroup[];
  lastSynced?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // e.g. 20%
  levels: {
    score: number; // 1, 2, 3, 4
    label: string; // "Beginning", "Developing", "Proficient", "Exemplary"
    descriptor: string;
  }[];
}

export interface RubricEvaluation {
  id: string;
  classId: string;
  groupId?: string;
  studentId?: string;
  criterionScores: Record<string, number>; // criterionId -> score (1..4)
  overallFeedback: string;
  evaluatedAt: string;
  evaluator: string;
}

export interface ScienceQuest {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  completed: boolean;
  dueDate: string;
}

export interface ScienceBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  targetPlatform: 'Google Classroom' | 'Bina Bangsa SIS' | 'Schoology' | 'Canvas LMS';
  recordsSynced: number;
  status: 'success' | 'warning' | 'in_progress';
  message: string;
}

export interface ParentalControlSettings {
  dailyLearningTimeCapMinutes: number;
  allowedTopics: ScienceInterest[];
  weeklyEmailDigest: boolean;
  safeSearchLocked: boolean;
  viewHistory: { date: string; minutesSpent: number; topic: string }[];
}

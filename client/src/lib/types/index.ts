export type Photo = {
  id: string;
  url: string;
  isMain: boolean;
}

export type Announcement = {
  id: string;
  title: string;
  description: string;
  text: string;
  date: string;
  mainPhotoUrl: string | null;
  photos: Photo[];
}

export type PagedResult<T, TCursor> = {
  items: T[];
  nextCursor: TCursor;
}

// Alias for components that use PagedList
export type PagedList<T> = {
  items: T[];
  nextCursor: string | null;
}

export type Puzzle = {
  id: string;
  number: number;
  description: string;
  fen: string;
  previousMove?: string | null;
  solution: string;
  difficulty: string;
  points: number;
  rating?: number | null;
  whiteToMove: boolean;
  category: string;
  isCompleted: boolean;
}

export type CompletePuzzleResult = {
  rating: number;
  // false when already solved, or (for students) solved out of number order
  pointsAwarded: boolean;
  alreadyCompleted: boolean;
  nextPuzzleNumber: number | null;
}

export type PuzzleStatGroup = {
  name: string;
  completed: number;
  total: number;
}

export type PuzzleStats = {
  totalPuzzles: number;
  completedCount: number;
  pointsEarned: number;
  averageRating: number | null;
  highestRating: number | null;
  nextPuzzleNumber: number | null;
  lastPuzzleNumber: number | null;
  byDifficulty: PuzzleStatGroup[];
  byRating: PuzzleStatGroup[];
  byCategory: PuzzleStatGroup[];
}

export type PuzzlePlaylist = {
  items: Puzzle[];
  currentNumber: number | null;
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  roles: string[];
}

export type Profile = {
  id: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  roles: string[];
  // Student-specific (optional)
  birthDate?: string | null;
  address?: string | null;
  school?: string | null;
  dateOfJoiningClub?: string | null;
  clubRating?: number | null;
  fideRating?: number | null;
  puzzlePoints?: number | null;
  teacherName?: string | null;
  // Teacher-specific (optional)
  bio?: string | null;
  specialization?: string | null;
  studentCount?: number;
}

export type Invitation = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export type InvitationResult = {
  registrationLink: string;
  expiresAt: string;
}

export type InvitationValidation = {
  email: string;
  role: string;
}

export type Lesson = {
  id: string;
  topic: string;
  startingTime: string;
  notes: string | null;
  teacherId: string;
  teacherName: string;
  attendedStudentsCount: number;
  students: LessonStudent[];
}

export type LessonStudent = {
  studentId: string;
  studentName: string;
}

export type OffsetPagedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

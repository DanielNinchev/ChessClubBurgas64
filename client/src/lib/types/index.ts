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
  title: string;
  description: string;
  fen: string;
  solution: string;
  difficulty: string;
  date: string;
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

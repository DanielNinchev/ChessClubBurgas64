type PagedList<T, TCursor> = {
  items: T[],
  nextCursor: TCursor
}

type ResetPassword = {
  email: string
  resetCode: string
  newPassword: string
}

type Announcement = {
  id: string;
  title: string;
  date: Date;
  description: string;
  text: string;
  mainPhotoUrl: string;
  photos: Photo[]
}

type Photo = {
  id: string
  url: string
  isMain: boolean;
}

type Profile = {
  id: string
  displayName: string
  bio?: string
  imageUrl?: string
}

type Puzzle = {
  id: number;
  title: string;
  description: string;
  solution: string;
  points: number;
  difficulty: string;
  photoUrl: string;
  photo: Photo
}

type User = {
  id: string
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  isAdmin: boolean;
}

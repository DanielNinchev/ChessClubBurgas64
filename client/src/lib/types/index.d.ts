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
  followersCount?: number
  followingCount?: number
  following?: boolean
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

type ChatComment = {
  id: string
  createdAt: Date
  body: string
  userId: string
  displayName: string
  imageUrl?: string
}

type LocationIQSuggestion = {
  place_id: string
  osm_id: string
  osm_type: string
  licence: string
  lat: string
  lon: string
  boundingbox: string[]
  class: string
  type: string
  display_name: string
  display_place: string
  display_address: string
  address: LocationIQAddress
}

type LocationIQAddress = {
  name: string
  house_number: string
  road: string
  suburb?: string
  town?: string
  village?: string
  city?: string
  county: string
  state: string
  postcode: string
  country: string
  country_code: string
  neighbourhood?: string
}

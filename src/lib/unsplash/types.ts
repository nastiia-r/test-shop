export interface ApiUser {
  id: string;
  username: string;
  name: string;
  location: string | null;
  bio: string | null;
  profile_image: { small: string; medium: string; large: string };
  links: { html: string };
}

export interface ApiTag {
  type: string;
  title: string;
}

export interface ApiPhoto {
  id: string;
  slug?: string;
  width: number;
  height: number;
  color: string | null;
  blur_hash: string | null;
  description: string | null;
  alt_description: string | null;
  created_at: string;
  likes: number;
  premium?: boolean;
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  links: { html: string; download_location: string };
  user: ApiUser;
}

export interface ApiPhotoDetails extends ApiPhoto {
  views?: number;
  downloads?: number;
  tags?: ApiTag[];
  location?: { name: string | null; city: string | null; country: string | null } | null;
  exif?: {
    make: string | null;
    model: string | null;
    name: string | null;
    exposure_time: string | null;
    aperture: string | null;
    focal_length: string | null;
    iso: number | null;
  } | null;
}

export interface ApiSearchResponse {
  total: number;
  total_pages: number;
  results: ApiPhoto[];
}

export interface Author {
  username: string;
  name: string;
  avatar: string;
  profileUrl: string;
}

export interface Photo {
  id: string;
  width: number;
  height: number;
  color: string;
  alt: string;
  src: string;
  author: Author;
}

export interface PhotoDetails extends Photo {
  description: string | null;
  createdAt: string;
  likes: number;
  views: number | null;
  downloads: number | null;
  tags: string[];
  location: string | null;
  camera: string | null;
  exif: { label: string; value: string }[];
  unsplashUrl: string;
}

export interface PhotoPage {
  photos: Photo[];
  page: number;
  totalPages: number;
  total: number;
}

export type Orientation = 'landscape' | 'portrait' | 'squarish';
export type SearchOrder = 'relevant' | 'latest';

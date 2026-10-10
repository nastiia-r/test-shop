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

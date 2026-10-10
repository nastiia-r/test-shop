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

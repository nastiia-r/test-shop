import 'server-only';

import { withUtm } from '@/shared/lib/utm';
import type { Author, Photo, PhotoDetails } from '@/shared/types/photo';

import type { ApiPhoto, ApiPhotoDetails, ApiUser } from './api-types';

const FALLBACK_COLOR = '#e7e7e7';

function toAuthor(user: ApiUser): Author {
  return {
    username: user.username,
    name: user.name,
    avatar: user.profile_image.medium,
    profileUrl: withUtm(user.links.html),
  };
}

export function toPhoto(photo: ApiPhoto): Photo {
  return {
    id: photo.id,
    width: photo.width,
    height: photo.height,
    color: photo.color ?? FALLBACK_COLOR,
    alt: photo.alt_description ?? photo.description ?? `Photo by ${photo.user.name}`,
    src: photo.urls.raw,
    author: toAuthor(photo.user),
  };
}

function formatLocation(location: ApiPhotoDetails['location']): string | null {
  if (!location) return null;
  if (location.name) return location.name;
  return [location.city, location.country].filter(Boolean).join(', ') || null;
}

function formatExif(exif: ApiPhotoDetails['exif']): {
  camera: string | null;
  items: { label: string; value: string }[];
} {
  if (!exif) return { camera: null, items: [] };

  const camera = exif.name ?? ([exif.make, exif.model].filter(Boolean).join(' ') || null);
  const items = [
    { label: 'Focal length', value: exif.focal_length ? `${exif.focal_length}mm` : null },
    { label: 'Aperture', value: exif.aperture ? `ƒ/${exif.aperture}` : null },
    { label: 'Shutter speed', value: exif.exposure_time ? `${exif.exposure_time}s` : null },
    { label: 'ISO', value: exif.iso ? String(exif.iso) : null },
  ].filter((item): item is { label: string; value: string } => item.value !== null);

  return { camera, items };
}

export function toPhotoDetails(photo: ApiPhotoDetails): PhotoDetails {
  const { camera, items } = formatExif(photo.exif);
  const tags = [...new Set((photo.tags ?? []).map((tag) => tag.title.trim().toLowerCase()))].filter(Boolean);

  return {
    ...toPhoto(photo),
    description: photo.description ?? photo.alt_description,
    createdAt: photo.created_at,
    likes: photo.likes,
    views: photo.views ?? null,
    downloads: photo.downloads ?? null,
    tags,
    location: formatLocation(photo.location),
    camera,
    exif: items,
    unsplashUrl: withUtm(photo.links.html),
  };
}

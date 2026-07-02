// Editor-only type reference for the Mongoose schemas in ../models — this project has no
// TypeScript build step, so nothing imports this file at runtime; it exists purely for
// IDE autocomplete/hover when working on model-shaped data (e.g. seedLocations.js).
import type { Types } from 'mongoose';

export type Rarity = 'common' | 'rare' | 'superior' | 'epic' | 'mythic' | 'legend';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationDescription {
  en: string;
  cz: string;
  zh: string;
}

export interface LocalizedNames {
  cz: string;
  zh: string;
}

export interface Location {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  labels: string[];
  coordinates: Coordinates;
  description: LocationDescription;
  localizedNames: LocalizedNames;
  wikipediaUrl: string;
  coverImage: string;
  pixelArtKey: string;
  addedBy: Types.ObjectId | null;
  xpReward: number;
  rarity: Rarity;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckIn {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  location: Types.ObjectId;
  note: string;
  checkedInAt: Date;
}

export interface Achievement {
  id: string;
  unlockedAt: Date;
}

export interface User {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  totalXP: number;
  explorerLevel: number;
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}

// Shape returned by User.prototype.toPublicJSON() — omits the password hash.
export interface PublicUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  totalXP: number;
  explorerLevel: number;
  achievements: Achievement[];
  createdAt: Date;
}

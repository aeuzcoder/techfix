import { User as FirebaseUser } from 'firebase/auth';

export type Plan = 'free' | 'premium' | 'pro';
export type Role = 'user' | 'admin';
export type Language = 'uz' | 'ru' | 'en';

export interface User {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: Role;
  plan: Plan;
  planExpiresAt?: string;
  language: Language;
  createdAt: string;
  updatedAt?: string;
}

export type { FirebaseUser };

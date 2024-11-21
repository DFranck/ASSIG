// src/models/userModel.ts
import { Document, ObjectId, WithId } from 'mongodb';

export interface User extends WithId<Document> {
  // required
  username: string; // username displayed with any type of punctuation or special characters
  usernameNormalized: string; // username without any type of punctuation and lowercase to guarantee uniqueness
  email: string;
  // optional
  firsname?: string;
  lastname?: string;
  password?: string | null;
  oauthProvider?: string;
  profileImage?: string;
  projects?: ObjectId[];
  resetCode?: string | null;
  resetCodeExpiresAt?: Date | null;
  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

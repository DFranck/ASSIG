import { ObjectId } from 'mongodb';

// src/models/userModel.ts
export interface User {
  // required
  _id: ObjectId; // mongo id
  username: string; // username displayed with any type of punctuation or special characters
  usernameNormalized: string; // username without any type of punctuation and lowercase to guarantee uniqueness
  email: string;
  // optional
  firsname: string;
  lastname: string;
  password: string | null;
  oauthProvider?: string;
  profileImage: string;
  projects: ObjectId[];
  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

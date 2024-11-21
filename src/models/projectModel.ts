// src/models/projectModel.ts

import { Document, ObjectId, WithId } from 'mongodb';

export interface Project extends WithId<Document> {
  // required
  title: string;
  description: string;
  userId: ObjectId;
  location: string;
  latitude: number;
  longitude: number;
  mapZoom: number;
  // optional
  projectImage?: string;
  pins: ObjectId[];
  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

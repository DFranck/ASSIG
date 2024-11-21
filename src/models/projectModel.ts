import { ObjectId } from 'mongodb';

export interface Project {
  _id: ObjectId;
  title: string;
  description: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

import { Request } from "express";

export type Course = {
  id: string;
  title: string;
  description: string;
  instructors: string[];
  students: string[];
  syllabus: string[];
};

export type Organisation = {
  id: string;
  name: string;
  owner: string;
  courses: string[];
  members: string[];
  roles: string[];
};

export type UserTokens = {
  id: string;
  encrypted_refresh_token: string;
  hashed_access_token: string;
};

export type GoogleUser ={
  email: string;
  name: string;
  picture: string;
}

export type UserInfo = {
  oauth_id: string;
  oauth_provider: string;
  email: string;
  name: string;
  profile_url: string;
};

export interface RequestWithUser extends Request {
  user: GoogleUser;
}

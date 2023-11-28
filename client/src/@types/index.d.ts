import { Session, User } from 'next-auth';

export interface SessionWithToken extends Session {
  accessToken: string;
  error: unknown;
  user: DbUser;
}

export interface DbUser extends User {
  id: string;
  oauth_id: string;
  oauth_provider: string;
  roles: string[];
}


export type THelpRequest = {
  id: string;
  course: string;
  students: string[];
  status: string;
  instructor: string | null;
  content: string;
  created_at: Date;
  time_waiting: number;
  time_in_call: number | null
}

export interface Course {
  id: string;
  organisation: string;
  title: string;
  description: string;
  instructors: string[];
  students: string[];
  syllabus: string[];
}

export interface CourseComponetProps {
  course: Course;
}

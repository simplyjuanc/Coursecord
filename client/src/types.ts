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

export interface NavItem {
  title: string;
  href: string;
  icon: JSX.Element;
}

export interface Unit {
  id: string;
  owner: string;
  title: string;
  type: string;
  markdown_body: string;
}

export interface Section {
  id: string;
  title: string;
  units: Unit[];
}
import { Session, User } from "next-auth";

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
  image: string?;
}

export type THelpRequest = {
  finished_at: Date;
  id: string;
  course: string;
  students: DbUser[];
  status: "WAITING" | "ASSIGNED" | "FINISHED";
  instructor: DbUser;
  content: string;
  created_at: Date;
  time_waiting: number;
  time_in_call: number | null;
};

export interface Course {
  id: string;
  organisation: string;
  title: string;
  description: string;
  instructors: string[];
  students: string[];
  syllabus: string[];
}

export interface Unit {
  id: string;
  owner: string;
  title: string;
  type: "lesson" | "excercise" | "test";
  markdown_body: string;
}

export interface Section {
  id: string;
  title: string;
  units: string[];
}

export interface CompiledSection extends Section {
  units: Unit[];
}

export interface CourseInfo {
  id: string;
  organisation: string;
  title: string;
  description: string;
  students: DbUser[];
  instructors: DbUser[];
}

export interface CourseState {
  courseInfo?: CourseInfo;
  syllabus?: CompiledSection[];
  students: DbUser[];
  instructors: DbUser[];
}

export interface UserState {
  id: string;
  coursesAsStudent: Course[];
  coursesAsInstructor: Course[];
  roles: RoleWithOrg[];
}

export interface IRole {
  id: string;
  title: string;
  permissions: string[];
}

export interface RoleWithOrg extends IRole {
  organisation: string;
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

export interface OrgState {
  orgInfo: OrgInfo;
}

export interface OrgInfo {
  id: string;
  name: string;
  description: string;
  courses: Course[];
  members: string[];
  roles: [];
}

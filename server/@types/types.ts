import { Role, User } from "@prisma/client";
import { Request } from "express";
import { Socket } from "socket.io";

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
  image: string;
};

export type CourseUnitInfo = {
  title: string;
  type: string;
  markdown_body: string;
}

export type CourseSectionInfo = {
  title: string;
  course_id: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface SocketWithUser extends Socket { 
  user?: User 
  roles?: Role[];
}

export type THelpRequest ={
  id: string;
  content: string;
  course_id: string;
  students: string[];
  instructor_id: string | undefined;
  status: 'WAITING' | 'ASSIGNED' | 'FINISHED';
}

export type TCreateHelpRequest = Pick<THelpRequest, "content" | "course_id" | "students">;
export type HelpRequestStatus = Pick<THelpRequest, "status">;
export type HelpRequestInstructor = Pick<THelpRequest, "instructor_id">;

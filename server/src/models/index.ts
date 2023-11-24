import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const Organisation = prisma.organisation;
const Course = prisma.course;
const User = prisma.user;
const CourseContent = prisma.courseContent;
const HelpRequest = prisma.helpRequest;
const Role = prisma.role;

export {
  Organisation,
  Course,
  User,
  Role,
  CourseContent,
  HelpRequest
}


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const Organisation = prisma.organisation;
const User = prisma.user;
const Role = prisma.role;

const Course = prisma.course;
const CourseUnit = prisma.courseUnit;
const CourseSection = prisma.courseSection;

const HelpRequest = prisma.helpRequest;

export {
  Organisation,
  Course,
  User,
  Role,
  CourseUnit,
  HelpRequest,
  CourseSection
}


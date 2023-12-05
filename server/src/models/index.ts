import { PrismaClient } from '@prisma/client';

const url = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url,
    },
  },
});

const Organisation = prisma.organisation;
const User = prisma.user;

const Course = prisma.course;
const CourseUnit = prisma.courseUnit;
const CourseSection = prisma.courseSection;

const HelpRequest = prisma.helpRequest;

export { Organisation, Course, User, CourseUnit, HelpRequest, CourseSection };

export default prisma;

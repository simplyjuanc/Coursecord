// jest.setup.ts

import { MongoMemoryServer } from 'mongodb-memory-server';
import { PrismaClient, Organisation } from '@prisma/client';
import {
  adminUser,
  adminUserOrg,
  course1,
  instructorUser,
  plebUser,
  studentUser,
  sections,
  units,
} from './src/mocks/initialDbMocks';

let mongod: MongoMemoryServer;
let prisma: PrismaClient;


beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('TEST URI', uri);
  process.env.DATABASE_URL = uri;
  
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  
  await prisma.user.create({ data: adminUser });
  await prisma.user.create({ data: instructorUser });
  await prisma.user.create({ data: studentUser });
  await prisma.user.create({ data: plebUser });

  await prisma.organisation.create({ data: adminUserOrg });
  await prisma.course.create({
    data: {
      ...course1,
      instructors: { create: { instructor_id: instructorUser.id } },
      students: { create: { student_id: studentUser.id } },
      syllabus: { createMany: { data: sections } },
    },
  });

  await prisma.courseUnit.createMany({
    data: units.map((unit, index) => ({
      ...unit,
      section: {
        create: { data: { section_id: sections[Math.floor(30 / index)] } },
      },
    })),
  });
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }

  if (prisma) {
    await prisma.$disconnect();
  }
});

export async function initTestDB(prisma: PrismaClient) {}

export async function clearTestDB(prisma: PrismaClient) {
  await prisma.courseUnit.deleteMany();
  await prisma.course.deleteMany();
  await prisma.organisation.deleteMany();
  await prisma.user.deleteMany();
}
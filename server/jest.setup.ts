// jest.setup.ts

import prisma from './src/models';
import {
  adminUser,
  adminUserOrg,
  course1,
  instructorUser,
  plebUser,
  studentUser,
  sectionsNoCourseId as sections,
  units,
} from './src/mocks/initialDbMocks';

afterAll(async () => {
  prisma.$disconnect();
});

export async function initTestDB() {
  await prisma.user.create({ data: adminUser });
  await prisma.user.create({ data: instructorUser });
  await prisma.user.create({ data: studentUser });
  await prisma.user.create({ data: plebUser });

  await prisma.organisation.create({
    data: { ...adminUserOrg, admins: { create: { user_id: adminUser.id } } },
  });
  await prisma.course.create({
    data: {
      ...course1,
      instructors: { create: { instructor_id: instructorUser.id } },
      students: { create: { student_id: studentUser.id } },
      syllabus: { createMany: { data: sections } },
    },
  });

  await prisma.courseUnit.createMany({
    data: units.map((unit) => ({
      ...unit,
    })),
  });

  let i = 0;
  for (const section of sections) {
    await prisma.courseSection.update({
      where: { id: section.id },
      data: { course_units: { create: { unit_id: units[i].id } } },
    });
  }

  console.log('test db initialised');
}

export async function clearTestDB() {
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.courseUnit.deleteMany();
  await prisma.organisation.deleteMany();
  await prisma.courseSection.deleteMany();
  await prisma.helpRequest.deleteMany();
  await prisma.courseSectionUnit.deleteMany();
  await prisma.courseSection.deleteMany();
  await prisma.organisationUser.deleteMany();
  await prisma.courseInstructors.deleteMany();
  await prisma.courseStudents.deleteMany();
  console.log('test db cleared');
}

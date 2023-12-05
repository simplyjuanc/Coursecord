import supertest from 'supertest';
import server from '../server';

import { clearTestDB, initTestDB } from '../../jest.setup';
import prisma from '../../src/models';
import { course1, sections } from '../mocks/initialDbMocks';

const request = supertest(server);

describe('CourseSection Router', () => {
  beforeEach(async () => {
    await clearTestDB();
    await initTestDB();
  });

  afterAll(async () => {
    await clearTestDB();
  });

  describe('get syllabus', () => {
    it('should return 200 and the syllabus if course exists', async () => {
      const response = await request.get(`/section/syllabus/${course1.id}`);

      expect(response.status).toBe(200);
      const course1Syllabus = (await prisma.course.findUnique({
        where: { id: course1.id },
        select: { syllabus: { include: { course_units: true } } },
      }))!.syllabus;

      expect(response.body).toEqual(course1Syllabus);
    });

    it('should return 500 if sent with invalid params', async () => {
      const response = await request.get('/section/syllabus/100');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
  });

  describe('add section', () => {
    it('should return 201 and the new section if course exists', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      const response = await request
        .post(`/section/auth/${course1.id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'test section' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'test section');
      expect(await prisma.courseSection.findMany()).toHaveLength(5);
    });

    it('should return 500 if sent with invalid params', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      const response = await request
        .post('/section/auth/100')
        .set('x-test-user', 'admin')
        .send({ title: 'test section' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
    });

    it('should return 500 if the user is not an admin', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      const response = await request
        .post(`/section/auth/${course1.id}`)
        .set('x-test-user', 'student')
        .send({ title: 'test section' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
    });

    it('should return 401 if the user is not logged in', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      const response = await request
        .post(`/section/auth/${course1.id}`)
        .send({ title: 'test section' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
    });
  });

  describe('edit section', () => {
    it('should return 200 and the updated section if course exists', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(
        await prisma.courseSection.findUnique({ where: { id: sections[0].id } })
      ).toEqual(sections[0]);
      const response = await request
        .put(`/section/auth/${sections[0].id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'test section' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'test section');
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(
        await prisma.courseSection.findUnique({ where: { id: sections[0].id } })
      ).not.toEqual(sections[0]);
    });

    it('should return 500 if sent with invalid params', async () => {
      const response = await request
        .put('/section/auth/100')
        .set('x-test-user', 'admin')
        .send({ title: 'test section' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
    });

    it('should return 500 if the user is not an admin', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(await prisma.courseSection.findUnique({ where: { id: sections[0].id } })).toEqual(sections[0]);
      const response = await request
        .put(`/section/auth/${sections[0].id}`)
        .set('x-test-user', 'student')
        .send({ title: 'test section' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(await prisma.courseSection.findUnique({ where: { id: sections[0].id } })).toEqual(sections[0]);
    });

    it('should return 401 if the user is not logged in', async () => {
      const sectionId = (await prisma.courseSection.findFirst())!.id;
      const response = await request
        .put(`/section/auth/${sectionId}`)
        .send({ title: 'test section' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
    });
  });

  describe.only('delete section', () => {
    it('should return 204 and the deleted section if course exists', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(
        await prisma.courseSection.findUnique({ where: { id: sections[0].id } })
      ).toEqual(sections[0]);
      const response = await request
        .delete(`/section/auth/${sections[0].id}`)
        .set('x-test-user', 'admin');

      expect(response.status).toBe(204);
      expect(await prisma.courseSection.findMany()).toHaveLength(3);
      expect(
        await prisma.courseSection.findUnique({ where: { id: sections[0].id } })
      ).toBeNull();
    });

    it('should return 500 if sent with invalid params', async () => {
      const response = await request
        .delete('/section/auth/100')
        .set('x-test-user', 'admin');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
    });

    it('should return 500 if the user is not an admin', async () => {
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(
        await prisma.courseSection.findUnique({ where: { id: sections[0].id } })
      ).toEqual(sections[0]);
      const response = await request
        .delete(`/section/auth/${sections[0].id}`)
        .set('x-test-user', 'student');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseSection.findMany()).toHaveLength(4);
      expect(
        await prisma.courseSection.findUnique({ where: { id: sections[0].id } })
      ).toEqual(sections[0]);
    });

    it('should return 401 if the user is not logged in', async () => {
      const sectionId = (await prisma.courseSection.findFirst())!.id;
      const response = await request.delete(`/section/auth/${sectionId}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
    });
  });
});

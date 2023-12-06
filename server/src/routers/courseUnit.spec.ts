import supertest from 'supertest';
import server from '../server';

import { clearTestDB, initTestDB } from '../../jest.setup';
import prisma from '../../src/models';
import {
  adminUserOrg,
  course1,
  sections,
  units,
} from '../mocks/initialDbMocks';

const request = supertest(server);

describe('CourseUnit Router', () => {
  beforeEach(async () => {
    await clearTestDB();
    await initTestDB();
  });

  afterAll(async () => {
    await clearTestDB();
  });

  describe('get unit', () => {
    it('should return unit when accessed by student instructor or admin', async () => {
      const response1 = await request
        .get(`/unit/auth/${course1.id}/${units[0].id}`)
        .set('x-test-user', 'student');

      expect(response1.status).toBe(200);
      expect(response1.body).toEqual(units[0]);

      const response2 = await request
        .get(`/unit/auth/${course1.id}/${units[0].id}`)
        .set('x-test-user', 'instructor');

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(units[0]);

      const response3 = await request
        .get(`/unit/auth/${course1.id}/${units[0].id}`)
        .set('x-test-user', 'instructor');

      expect(response3.status).toBe(200);
      expect(response3.body).toEqual(units[0]);
    });

    it('should return 401 when accessed by pleb', async () => {
      const response = await request
        .get(`/unit/auth/${course1.id}/${units[0].id}`)
        .set('x-test-user', 'pleb');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'unit can not be accessed' });
    });

    it('should return 401 when accessed by without access token', async () => {
      const response = await request.get(
        `/unit/auth/${course1.id}/${units[0].id}`
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
    });

    it('should return 500 when accessed by without correct params', async () => {
      const response = await request
        .get(`/unit/auth/123/123`)
        .set('x-test-user', 'student');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
    });
  });

  describe('add unit', () => {
    it('should return 200 and create the unit when accessed by admin', async () => {
      expect(await prisma.courseUnit.count()).toBe(10);
      const initialSection = await prisma.courseSection.findUnique({
        where: { id: sections[0].id },
        select: { course_units: true },
      });
      expect(initialSection!.course_units.length).toBe(1);

      const response = await request
        .post(`/unit/auth/org/${adminUserOrg.id}/${sections[0].id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'test unit', type: 'test' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('newUnit');
      expect(response.body.newUnit.title).toEqual('test unit');
      expect(response.body.newUnit.type).toEqual('test');
      const updatedSection = await prisma.courseSection.findUnique({
        where: { id: sections[0].id },
        include: { course_units: true },
      });
      expect(response.body).toHaveProperty('updatedSection');
      expect(response.body.updatedSection.id).toEqual(sections[0].id);
      expect(updatedSection!.course_units.length).toBe(2);
      expect((await prisma.courseUnit.findMany()).length).toBe(11);
    });

    it('should return 500 when accessed by accessed by not an admin', async () => {
      expect(await prisma.courseUnit.count()).toBe(10);
      const response = await request
        .post(`/unit/auth/org/${adminUserOrg.id}/${sections[0].id}`)
        .set('x-test-user', 'student')
        .send({ title: 'test unit', type: 'test' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseUnit.count()).toBe(10);
    });

    it('should return 401 when accessed without access token', async () => {
      expect(await prisma.courseUnit.count()).toBe(10);
      const response = await request
        .post(`/unit/auth/org/${adminUserOrg.id}/${sections[0].id}`)
        .send({ title: 'test unit', type: 'test' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
      expect(await prisma.courseUnit.count()).toBe(10);
    });
  });

  describe('edit unit', () => {
    it('should return 200 and edit the unit when accessed by admin', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.put(`/unit/auth/${units[0].id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'edited title', type: 'edited type' });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({...units[0], title: 'edited title', type: 'edited type'});
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).not.toEqual(inititialUnit);
    });

    it('should return 500 when accessed by not an admin', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.put(`/unit/auth/${units[0].id}`)
        .set('x-test-user', 'student')
        .send({ title: 'edited title', type: 'edited type' });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).toEqual(inititialUnit);
    });

    it('should return 401 when accessed without access token', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.put(`/unit/auth/${units[0].id}`)
        .send({ title: 'edited title', type: 'edited type' });
      
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).toEqual(inititialUnit);
    });

    it('should return 500 when accessed with wrong params', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.put(`/unit/auth/123`)
        .set('x-test-user', 'admin')
        .send({ title: 'edited title', type: 'edited type' });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).toEqual(inititialUnit);
    });
  });

  describe.only('delete unit', () => {
    it('should return 200 and delete the unit when accessed by admin', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);
      expect(await prisma.courseSection.count()).toBe(4);

      const response = await request.delete(`/unit/auth/${units[0].id}`)
        .set('x-test-user', 'admin');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(inititialUnit);
      expect(await prisma.courseUnit.count()).toBe(9);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(await prisma.courseSection.count()).toBe(4);
      expect(updatedUnit).toBeNull();
    });

    it('should return 500 when accessed by not an admin', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.delete(`/unit/auth/${units[0].id}`)
        .set('x-test-user', 'student');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).toEqual(inititialUnit);
    });

    it('should return 401 when accessed without access token', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.delete(`/unit/auth/${units[0].id}`);
      
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No access token found' });
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).toEqual(inititialUnit);
    });

    it('should return 500 when accessed with wrong params', async () => {
      const inititialUnit = await prisma.courseUnit.findUnique({
        where: { id: units[0].id },
      });
      expect(await prisma.courseUnit.count()).toBe(10);

      const response = await request.delete(`/unit/auth/123`)
        .set('x-test-user', 'admin');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
      expect(await prisma.courseUnit.count()).toBe(10);
      const updatedUnit = await prisma.courseUnit.findUnique({where: {id: units[0].id}});

      expect(updatedUnit).toEqual(inititialUnit);
    });
  });

  //TODO: ADD TEST FOR ADDING UNIT TO SECTION AND REMOVING UNIT FROM SECTION (RN no frontend so for this so idc)
});

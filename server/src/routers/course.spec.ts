import supertest from 'supertest';
import server from '../server';
import {
  adminUserOrg,
  course1,
  instructorUser,
  plebUser,
  studentUser,
} from '../mocks/initialDbMocks';
import { clearTestDB, initTestDB } from '../../jest.setup';
import prisma from '../../src/models';

const request = supertest(server);

describe.skip('Course Router', () => {
  beforeEach(async () => {
    await clearTestDB();
    await initTestDB();
  });

  afterAll(async () => {
    await clearTestDB();
  });

  describe('get courses', () => {
    it('should respond with 200 and an array of courses when sent with valid params', async () => {
      const response = await request.get(`/course/`).send();

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('title', 'Test Course1');
      expect(response.body[0]).toHaveProperty(
        'description',
        'Test Course1 description'
      );
    });
  });

  describe('add course', () => {
    it('should respond with 200 and the created course when sent with valid body and params ', async () => {
      expect(await prisma.course.findMany()).toHaveLength(1);

      const response = await request
        .post(`/course/auth/${adminUserOrg.id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'test', description: 'testCourse1' });

      expect(response.body).toHaveProperty('title', 'test');
      expect(response.body).toHaveProperty('description', 'testCourse1');
      expect(await prisma.course.findMany()).toHaveLength(2);
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      const response = await request
        .post(`/course/auth/123`)
        .set('x-test-user', 'admin')
        .send({ title: 'test', description: 'testCourse1' });

      expect(response.status).toBe(500);
    });

    it('should respond with an error code 500 when sent with invalid body', async () => {
      const response = await request
        .post(`/course/auth/${adminUserOrg.id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'test' });

      expect(response.status).toBe(500);
    });

    it('should respond with an error code 500 when sent with user without admin permissions', async () => {
      const response = await request
        .post(`/course/auth/${adminUserOrg.id}`)
        .set('x-test-user', 'instructor')
        .send({ description: 'test' });

      expect(response.status).toBe(500);
    });

    it('should respond with error code 401 when sent with no user', async () => {
      const response = await request
        .post(`/course/auth/${adminUserOrg.id}`)
        .send({ description: 'test' });

      expect(response.status).toBe(401);
    });
  });

  describe('get editCourse', () => {
    it('should respond with 200 and the edited course when sent with valid body and params ', async () => {
      const initialCourses = await prisma.course.findMany();
      expect(initialCourses).toHaveLength(1);
      expect(initialCourses[0]).toHaveProperty('title', 'Test Course1');

      const response = await request
        .put(`/course/auth/${course1.id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'different', description: 'wayy different' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'different');
      expect(response.body).toHaveProperty('description', 'wayy different');
      const updatedCourses = await prisma.course.findMany();
      expect(updatedCourses).toHaveLength(1);
      expect(updatedCourses[0]).toHaveProperty('title', 'different');
      expect(updatedCourses[0]).toHaveProperty('description', 'wayy different');
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      const response = await request
        .put(`/course/auth/123`)
        .set('x-test-user', 'admin')
        .send({ title: 'test', description: 'testCourse1' });

      expect(response.status).toBe(500);
    });

    it('should respond with an error code 500 when sent with invalid body', async () => {
      const response = await request
        .put(`/course/auth/${course1.id}`)
        .set('x-test-user', 'admin')
        .send({ tiny: 'peen' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Internal Server Error');
    });

    it('should respond with an error code 500 when sent with user without admin permissions', async () => {
      const response = await request
        .put(`/course/auth/${course1.id}`)
        .set('x-test-user', 'instructor')
        .send({ description: 'test' });

      expect(response.status).toBe(500);
    });

    it('should respond with an error code 401 when sent with no user', async () => {
      const response = await request
        .put(`/course/auth/${course1.id}`)
        .send({ description: 'test' });

      expect(response.status).toBe(401);
    });
  });

  describe('delete course', () => {
    it('should respond with 204 and delete the course when sent with valid params', async () => {
      expect(await prisma.course.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(204);
      expect(await prisma.course.findMany()).toHaveLength(0);
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      expect(await prisma.course.findMany()).toHaveLength(1);
      const response = await request
        .delete(`/course/auth/123`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.course.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 500 when sent with user without admin permissions', async () => {
      expect(await prisma.course.findMany()).toHaveLength(1);
      const response = await request
        .delete(`/course/auth/${course1.id}`)
        .set('x-test-user', 'instructor')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.course.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 401 when sent with no user', async () => {
      expect(await prisma.course.findMany()).toHaveLength(1);
      const response = await request
        .delete(`/course/auth/${course1.id}`)
        .send();

      expect(response.status).toBe(401);
      expect(await prisma.course.findMany()).toHaveLength(1);
    });

    it('should not delete instructors or students when deleting a course', async () => {
      expect(await prisma.course.findMany()).toHaveLength(1);
      expect(
        await prisma.user.findUnique({ where: { id: instructorUser.id } })
      ).toBeTruthy();
      expect(
        await prisma.user.findUnique({ where: { id: studentUser.id } })
      ).toBeTruthy();
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(204);
      expect(await prisma.course.findMany()).toHaveLength(0);
      expect(
        await prisma.user.findUnique({ where: { id: instructorUser.id } })
      ).toBeTruthy();
      expect(
        await prisma.user.findUnique({ where: { id: studentUser.id } })
      ).toBeTruthy();
      expect(await prisma.courseInstructors.findMany()).toHaveLength(0);
      expect(await prisma.courseStudents.findMany()).toHaveLength(0);
    });
  });

  describe('get course management info', () => {
    it('should respond with 200 and the course management info when sent with valid params', async () => {
      const response = await request
        .get(`/course/auth/${course1.id}/management`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Course1');
      expect(response.body).toHaveProperty(
        'description',
        'Test Course1 description'
      );
      expect(response.body).toHaveProperty('instructors', [
        {
          instructor: {
            id: instructorUser.id,
            name: instructorUser.name,
            email: instructorUser.email,
          },
        },
      ]);
      expect(response.body).toHaveProperty('students', [
        {
          student: {
            id: studentUser.id,
            name: studentUser.name,
            email: studentUser.email,
          },
        },
      ]);
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      const response = await request
        .get(`/course/auth/123/management`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(500);
    });

    it('should respond with an error code 401 when sent with user without admin permissions', async () => {
      const response = await request
        .get(`/course/auth/${course1.id}/management`)
        .set('x-test-user', 'instructor')
        .send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'message',
        'Unable to view course management info'
      );
    });

    it('should respond with 401 when sent with no user', async () => {
      const response = await request
        .get(`/course/auth/${course1.id}/management`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No access token found');
    });
  });

  describe('get course info', () => {
    it('should respond with 200 and the course info when sent with valid params', async () => {
      const response = await request.get(`/course/${course1.id}`).send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Course1');
      expect(response.body).toHaveProperty(
        'description',
        'Test Course1 description'
      );
      expect(response.body).toHaveProperty('instructors', [
        {
          instructor: {
            name: instructorUser.name,
            image: instructorUser.image,
          },
        },
      ]);
      expect(response.body).toHaveProperty('students', [
        {
          student: {
            name: studentUser.name,
            image: studentUser.image,
          },
        },
      ]);
      expect(response.body).toHaveProperty('organisation', {
        name: adminUserOrg.name,
      });
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      const response = await request.get(`/course/123`).send();

      expect(response.status).toBe(500);
    });
  });

  describe('add course instructor', () => {
    it('should add the instructor to the course when sent with valid params and respond with status 200', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/${course1.id}/instructor/${plebUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(200);
      expect(await prisma.courseInstructors.findMany()).toHaveLength(2);
      expect(
        await prisma.courseInstructors.findFirst({
          where: {
            course_id: course1.id,
            instructor_id: instructorUser.id,
          },
        })
      ).toBeTruthy();
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/123/instructor/${plebUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 500 when sent with user without permissions', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/${course1.id}/instructor/${plebUser.id}`)
        .set('x-test-user', 'instructor')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 401 when sent with no user', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/${course1.id}/instructor/${plebUser.id}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No access token found');
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
    });
  });

  describe('delete course instructor', () => {
    it('should delete the instructor from the course when sent with valid params and respond with status 200', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}/instructor/${instructorUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(200);
      expect(await prisma.courseInstructors.findMany()).toHaveLength(0);
      expect(
        await prisma.user.findUnique({ where: { id: instructorUser.id } })
      ).toBeTruthy();
      expect(
        await prisma.course.findUnique({ where: { id: course1.id } })
      ).toBeTruthy();
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/123/instructor/${instructorUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 500 when sent with user without permissions', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}/instructor/${instructorUser.id}`)
        .set('x-test-user', 'instructor')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 401 when sent with no user', async () => {
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}/instructor/${instructorUser.id}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No access token found');
      expect(await prisma.courseInstructors.findMany()).toHaveLength(1);
    });
  });

  describe('add student to course', () => {
    it('should add the student to the course when sent with valid params and respond with status 200', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/${course1.id}/student/${plebUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(200);
      expect(await prisma.courseStudents.findMany()).toHaveLength(2);
      expect(
        await prisma.courseStudents.findFirst({
          where: {
            course_id: course1.id,
            student_id: studentUser.id,
          },
        })
      ).toBeTruthy();
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/123/student/${plebUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 500 when sent with user without permissions', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/${course1.id}/student/${plebUser.id}`)
        .set('x-test-user', 'instructor')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 401 when sent with no user', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .put(`/course/auth/${course1.id}/student/${plebUser.id}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No access token found');
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);
    });
  });

  describe('delete student from course', () => {
    it('should delete the student from the course when sent with valid params and respond with status 200', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}/student/${studentUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(200);
      expect(await prisma.courseStudents.findMany()).toHaveLength(0);
      expect(
        await prisma.user.findUnique({ where: { id: studentUser.id } })
      ).toBeTruthy();
      expect(
        await prisma.course.findUnique({ where: { id: course1.id } })
      ).toBeTruthy();
    });

    it('should respond with an error code 500 when sent with invalid parms', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/123/student/${studentUser.id}`)
        .set('x-test-user', 'admin')
        .send();

      expect(response.status).toBe(500);
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 500 when sent with user without permissions', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}/student/${studentUser.id}`)
        .set('x-test-user', 'instructor')
        .send();
      
      expect(response.status).toBe(500);
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);
    });

    it('should respond with an error code 401 when sent with no user', async () => {
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);

      const response = await request
        .delete(`/course/auth/${course1.id}/student/${studentUser.id}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No access token found');
      expect(await prisma.courseStudents.findMany()).toHaveLength(1);
    });
  });
});

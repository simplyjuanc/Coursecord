import supertest from 'supertest';
import server from '../server';
import { mockCourse, mockOrganisation } from '../mocks/mocks';
import { adminUserOrg } from '../mocks/initialDbMocks';

const request = supertest(server);

describe('Course Router', () => {
  describe('add course', () => {
    it('should respond with 200 and the created course when sent with valid body and params ', async () => {
      const response = await request
        .post(`/course/auth/${adminUserOrg.id}`)
        .set('x-test-user', 'admin')
        .send({ title: 'test', description: 'testCourse1' });

      expect(response.body).toHaveProperty('title', 'test');
      expect(response.body).toHaveProperty('description', 'testCourse1');
    });
  });
  it('', async () => {});
});

import supertest from 'supertest';
import { prismaMock } from '../../singleton';
import server from '../server';
import { mockCourse, mockOrganisation } from '../mocks/mocks';

const request = supertest(server);

jest.mock('@prisma/client');

describe('Course Router', () => {
  describe('add course', () => {
    it('should respond with 200 and the created course when sent with valid body and params ', async () => {
      prismaMock.organisation.update.mockResolvedValue(mockOrganisation);

      const response = await request
        .post('/course/auth/1')
        .send({ title: 'test', description: 'test' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrganisation);
    });
  });
  it('', async () => {});
});

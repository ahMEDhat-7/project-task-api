import request from 'supertest';
import { app } from '../../../app';

describe('Auth Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return validation error for invalid input', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: '',
        email: 'invalid-email',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login${Date.now()}@example.com`;
      await request(app).post('/api/v1/auth/register').send({
        name: 'Login Test',
        email,
        password: 'password123',
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email,
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const email = `profile${Date.now()}@example.com`;
      const registerResponse = await request(app).post('/api/v1/auth/register').send({
        name: 'Profile Test',
        email,
        password: 'password123',
      });

      const token = registerResponse.body.data.token;

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(email);
    });

    it('should return error when not authenticated', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

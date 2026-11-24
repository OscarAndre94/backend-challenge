
import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';

import request from 'supertest';

import app from '../../../src/app.js';
import { prisma } from '../../../src/config/prisma.js';

describe('Users API - E2E Tests', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /users', () => {
    it('should create a user and return 201', async () => {
      const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123',
        pokemonIds: [25],
      };

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toMatchObject({
        username: userData.username,
        email: userData.email,
        pokemonIds: userData.pokemonIds,
      });

      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 409 when username or email already exists', async () => {
      const userData = {
        username: 'duplicateuser',
        email: 'duplicate@example.com',
        password: 'Password123',
        pokemonIds: [],
      };

      // First request: create the user.
      const firstResponse = await request(app)
        .post('/users')
        .send(userData);

      expect(firstResponse.status).toBe(201);

      // Second request: attempt to create the same user.
      const secondResponse = await request(app)
        .post('/users')
        .send(userData);

      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body.status).toBe('error');
      expect(secondResponse.body.message).toBe(
        'Username or email already exists',
      );
    });

    it('should return 400 when the JSON body is malformed', async () => {
      const response = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('{"username":');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Bad request');
    });
  });
});




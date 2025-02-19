require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => console.log('✅ MongoDB conectado correctamente'))
      .catch(err => {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        process.exit(1);
      });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  test('should fail to register a user with existing username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  test('should fail to register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  test('should fail register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  test('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should fail to login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});

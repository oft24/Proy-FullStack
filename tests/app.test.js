const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let mongoConnected = false;

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado correctamente para pruebas');
    mongoConnected = true;
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB para pruebas:', error.message);
    process.exit(1);
  }
});

describe('Pruebas básicas de la API', () => {

  beforeAll(() => {
    if (!mongoConnected) {
      console.error('❌ No se puede ejecutar las pruebas sin conexión a MongoDB');
      process.exit(1);
    }
  });

  test('GET / debería devolver status 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('GET /api debería devolver "API funcionando"', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('API funcionando');
  });

  test('Ruta no encontrada debería devolver 200 y redirigir a login', async () => {
    const response = await request(app).get('/ruta-inexistente');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('login');
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});

const request = require('supertest');
const app = require('../src/app');

describe('Foodie MERN API Integration Tests', () => {
  let userToken;
  let adminToken;
  let createdOrderId;

  test('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
  });

  test('POST /api/auth/register should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Customer',
      email: `testuser_${Date.now()}@foodie.com`,
      password: 'password123'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  test('POST /api/auth/login should authenticate user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'user@foodie.com',
      password: 'userpassword123'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  test('GET /api/categories should return food categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/restaurants should return restaurant listing with search', async () => {
    const res = await request(app).get('/api/restaurants?search=Garden');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  test('GET /api/menu should return menu items', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  test('POST /api/orders should place a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        restaurantId: 'rest_1',
        items: [
          { name: 'Greek Salad', price: 180, quantity: 2, image: '/assets/food_1.png' }
        ],
        deliveryAddress: {
          name: 'Test Customer',
          flat: 'Flat 101',
          street: 'Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          phone: '9876543210'
        },
        itemTotal: 360,
        deliveryFee: 25,
        grandTotal: 385,
        paymentMethod: 'MOCK_PAYMENT'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.orderId).toBeDefined();
    createdOrderId = res.body.data.orderId;
  });

  test('GET /api/orders/:id should retrieve order tracking timeline', async () => {
    const res = await request(app).get(`/api/orders/${createdOrderId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.orderId).toEqual(createdOrderId);
    expect(Array.isArray(res.body.data.timeline)).toBeTruthy();
  });

  test('POST /api/coupons/validate should calculate valid coupon discount', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'WELCOME50', orderTotal: 200 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.discount).toBeGreaterThan(0);
  });
});

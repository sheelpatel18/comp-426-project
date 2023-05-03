const request = require('supertest')
const api = require('./lib/api.js'); // Adjust the import path to match your app file

describe('API tests', () => {
  it('should start server and respond to /api/ping', async () => {
    const response = await request(api).get('/api/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('PONG'); // Replace 'pong' with the expected response from your /api/ping route
  });
});

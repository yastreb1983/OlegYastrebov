import request from "supertest";
import app from '../../../dist/app';
import http from 'http';
let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});

describe('login router', () => {
  test('It should respond to GET method', async () => {
    const response = await request(server).get("/login");
    expect(response.statusCode).toBe(200);
  });

  xtest('It responds to POST method with empty fields', async () => {
    const response = await request(server).post("/login")
      .send({email: 'john@mail.com' });
    const errorMessage = 'User not Found';
    expect(response.text.includes(errorMessage)).toEqual(true); 
    expect(response.statusCode).toBe(200);
  });

  test('renders a message about successful registration', async () => {
    const success = 'You have been registered successfully. Please, login to continue';
    const response = await request(server).get("/login?success=ok");

    expect(response.text.includes(success)).toEqual(true);
    expect(response.statusCode).toBe(200);
  })
});
import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import Admin from '@modules/admins/infra/typeorm/entities/Admin';

let connection: Connection;
describe('Session Admin', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM admins');

    const adm = new Admin();
    adm.password = '123456';
    await adm.encryptPassword();

    await connection.query(
      "INSERT INTO admins (firstname, lastname, email, password, level_access)VALUES('Admin', 'admin', 'admin@admin.com', $1, 1)",
      [adm.password],
    );
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should authenticate with valid credentials', async () => {
    const response = await request(app).post('/admins/session').send({
      email: 'admin@admin.com',
      password: '123456',
    });
    expect(response.status).toBe(200);
  });

  it('should return jwt token when authenticated', async () => {
    const response = await request(app).post('/admins/session').send({
      email: 'admin@admin.com',
      password: '123456',
    });
    expect(response.body).toHaveProperty('token');
  });

  it('should not authenticate with invalid credentials', async () => {
    const response = await request(app).post('/admins/session').send({
      email: 'admin@admin.com',
      password: '1234567',
    });
    expect(response.status).toBe(401);
  });
});

import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import { container } from 'tsyringe';
import CreateSessionAdminService from '@modules/admins/services/CreateSessionAdminService';
import Admin from '@modules/admins/infra/typeorm/entities/Admin';
import Factories from '../factory/factories';

let connection: Connection;
describe('Admin', () => {
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
    await connection.query(
      "INSERT INTO admins (firstname, lastname, email, password, level_access)VALUES('Admin', 'admin', 'admin@admin.com.br', $1, 2)",
      [adm.password],
    );
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should create an admin with valid credentials', async () => {
    const adminInfos = Factories.factoryAdmin();
    const createAdmin = container.resolve(CreateSessionAdminService);
    const token = await createAdmin.execute({
      email: 'admin@admin.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/admins')
      .send({
        firstname: adminInfos.firstname,
        lastname: adminInfos.lastname,
        password: adminInfos.password,
        level_access: adminInfos.level_access,
        email: adminInfos.email,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('should not create an admin with invalid credentials', async () => {
    const adminInfos = Factories.factoryAdmin();
    const createAdmin = container.resolve(CreateSessionAdminService);
    const token = await createAdmin.execute({
      email: 'admin@admin.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/admins')
      .send({
        firstname: adminInfos.firstname,
        lastname: adminInfos.lastname,
        password: adminInfos.password,
        level_access: adminInfos.level_access,
        email: adminInfos.email,
      })
      .set('Authorization', `Bearer 1f15s1f5sf5sf1`);
    expect(response.status).toBe(401);
  });

  it('should not create an admin with invalid level acess', async () => {
    const adminInfos = Factories.factoryAdmin();
    const createAdmin = container.resolve(CreateSessionAdminService);
    const token = await createAdmin.execute({
      email: 'admin@admin.com.br',
      password: '123456',
    });

    const response = await request(app)
      .post('/admins')
      .send({
        firstname: adminInfos.firstname,
        lastname: adminInfos.lastname,
        password: adminInfos.password,
        level_access: adminInfos.level_access,
        email: adminInfos.email,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});

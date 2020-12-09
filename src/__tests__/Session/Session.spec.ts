import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import Factories from '../factory/factories';

let connection: Connection;
describe('Session', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM addresses');
    await connection.query('DELETE FROM customers');
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should authenticate with valid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const createCustomer = container.resolve(CreateCustomerService);
    await createCustomer.execute(customer);

    const response = await request(app).post('/session').send({
      email: customer.email,
      password: customer.password,
    });
    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const createCustomer = container.resolve(CreateCustomerService);
    await createCustomer.execute(customer);

    const response = await request(app).post('/session').send({
      email: customer.email,
      password: '121212121',
    });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const customer = Factories.factoryCustomer();
    const createCustomer = container.resolve(CreateCustomerService);
    await createCustomer.execute(customer);

    const response = await request(app).post('/session').send({
      email: customer.email,
      password: customer.password,
    });
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .put('/customers')
      .set('Authorization', 'Bearer 1212132');

    expect(response.status).toBe(401);
  });
});

import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import Factories from '../factory/factories';
import DeleteTables from '../factory/deleteTables';

let connection: Connection;
describe('Customer', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await DeleteTables(connection);
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should create a customer with valid data', async () => {
    const customer = Factories.factoryCustomer();

    const response = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
      }),
    );
  });

  it('should not create a customer with invalid data', async () => {
    const customer = Factories.factoryCustomer();

    const response = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
    });

    expect(response.status).toBe(400);
  });

  it('should not create a customer if the email already exists', async () => {
    const customer = Factories.factoryCustomer();
    customer.email = 'test@test.com';

    const customerResponse = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    });

    expect(customerResponse.body).toEqual(
      expect.objectContaining({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
      }),
    );

    const response = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: '61132590578',
    });

    expect(response.status).toBe(400);
  });

  it('should not create a customer if the cpf already exists', async () => {
    const customer = Factories.factoryCustomer();
    customer.cpf = '61132590520';

    const customerResponse = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    });

    expect(customerResponse.body).toEqual(
      expect.objectContaining({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
      }),
    );

    const response = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: 'test@test.com',
      phone: customer.phone,
      cpf: customer.cpf,
    });

    expect(response.status).toBe(400);
  });

  it('should update the customer with valid credentials', async () => {
    const customer = Factories.factoryCustomer();

    const addCustomer = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    });
    expect(addCustomer.status).toBe(201);

    const token = await request(app).post('/session').send({
      email: customer.email,
      password: customer.password,
    });
    expect(token.status).toBe(200);

    const response = await request(app)
      .put('/customers')
      .send({
        firstname: 'Test testing',
        lastname: 'Test',
        phone: '85987854521',
      })
      .set('Authorization', `Bearer ${token.body.token}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        firstname: 'Test testing',
        lastname: 'Test',
        phone: '85987854521',
        email: customer.email,
        cpf: customer.cpf,
      }),
    );
  });

  it('should not update the customer with invalid credentials', async () => {
    const customer = Factories.factoryCustomer();

    const addCustomer = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    });
    expect(addCustomer.status).toBe(201);

    const response = await request(app)
      .put('/customers')
      .send({
        firstname: 'Test testing',
        lastname: 'Test',
        phone: '85987854521',
      })
      .set('Authorization', 'Bearer shfusfgsfhop');

    expect(response.status).toBe(401);
  });

  it('should not update the customer missing fields', async () => {
    const customer = Factories.factoryCustomer();

    const addCustomer = await request(app).post('/customers').send({
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
    });
    expect(addCustomer.status).toBe(201);

    const token = await request(app).post('/session').send({
      email: customer.email,
      password: customer.password,
    });
    expect(token.status).toBe(200);

    const response = await request(app)
      .put('/customers')
      .send({
        firstname: 'Test testing',
        phone: '85987854521',
      })
      .set('Authorization', `Bearer ${token.body.token}`);

    expect(response.status).toBe(400);
  });
});

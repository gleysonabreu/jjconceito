import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import { container } from 'tsyringe';
import Factories from '../factory/factories';

let connection: Connection;
describe('Category', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM addresses');
    await connection.query('DELETE FROM customers');
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should create an category with valid credentials', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const response = await request(app)
      .post('/products/categories')
      .send({
        name: category.name,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: category.name,
      }),
    );
  });

  it('should not create an category if you are not an admin', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const response = await request(app)
      .post('/products/categories')
      .send({
        name: category.name,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(401);
  });

  it('it should not return search data by category if there is no valid uuid', async () => {
    const response = await request(app).get('/products/categories/44dasfsfsf');
    expect(response.status).toBe(400);
  });

  it('should update an category with valid credentials', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const createCateg = await request(app)
      .post('/products/categories')
      .send({
        name: 'test',
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);
    expect(createCateg.status).toBe(200);

    const response = await request(app)
      .put(`/products/categories/${createCateg.body.id}`)
      .send({
        name: category.name,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: category.name,
      }),
    );
  });

  it('should not update an category with invalid credentials', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const createCateg = await request(app)
      .post('/products/categories')
      .send({
        name: 'test',
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);
    expect(createCateg.status).toBe(401);

    const response = await request(app)
      .put(`/products/categories/${createCateg.body.id}`)
      .send({
        name: category.name,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(400);
  });

  it('should delete an category with valid credentials', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const createCateg = await request(app)
      .post('/products/categories')
      .send({
        name: category.name,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);
    expect(createCateg.status).toBe(200);

    const response = await request(app)
      .delete(`/products/categories/${createCateg.body.id}`)
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);
    expect(response.status).toBe(200);
  });

  it('should not delete an category with invalid credentials', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const createCateg = await request(app)
      .post('/products/categories')
      .send({
        name: category.name,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);
    expect(createCateg.status).toBe(200);

    const response = await request(app)
      .delete(`/products/categories/${createCateg.body.id}`)
      .set('Authorization', `Bearer ghdg65623`);
    expect(response.status).toBe(401);
  });

  it('should not delete an category with invalid uuid', async () => {
    const category = Factories.factoryCategory();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const createCustomer = container.resolve(CreateCustomerService);
    const customerAdmin = await createCustomer.execute(customer);

    const response = await request(app)
      .delete(`/products/categories/sfs54fsf4-fsfs5f`)
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);
    expect(response.status).toBe(400);
  });
});

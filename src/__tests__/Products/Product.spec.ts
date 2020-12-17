import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import Factories from '../factory/factories';

let connection: Connection;
describe('Product', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM addresses');
    await connection.query('DELETE FROM customers');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM categories');
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should create an product with valid credentials', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    const category = Factories.factoryCategory();
    customer.level_access = 1;
    const customerCreate = container.resolve(CreateCustomerService);
    const createCateg = container.resolve(CreateCategoryService);
    const customerAdmin = await customerCreate.execute(customer);
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });

    const response = await request(app)
      .post('/products')
      .send({
        name: productFactory.name,
        quantity: productFactory.quantity,
        price: productFactory.price,
        category_id: categoryCreate.id,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(200);
  });
});

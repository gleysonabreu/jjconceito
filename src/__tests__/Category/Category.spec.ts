import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import Factories from '../factory/factories';

let connection: Connection;
describe('Category', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    // await connection.query('DELETE FROM products');
    // await connection.query('DELETE FROM categories');
  });

  afterAll(async () => {
    const myConnection = getConnection();

    await connection.close();
    await myConnection.close();
  });

  it('should create an category with valid credentials(add credentials valid after)', async () => {
    const category = Factories.factoryCategory();
    const response = await request(app).post('/products/categories').send({
      name: category.name,
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        name: category.name,
      }),
    );
  });

  it('should return search data by category', async () => {
    const response = await request(app).get(
      '/products/categories/c55d9de2-aaa6-4c52-9e3c-75714735495e',
    );

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'c55d9de2-aaa6-4c52-9e3c-75714735495e',
        name: 'Praia',
        products: expect.arrayContaining([
          expect.objectContaining({
            id: '984f15d8-e1c6-4ff3-bf39-f8fa389b60d8',
            name: 'Product 1',
            price: '13.2',
            quantity: 2,
          }),
        ]),
      }),
    );
  });

  it('it should not return search data by category if there is no valid uuid', async () => {
    const response = await request(app).get('/products/categories/44dasfsfsf');
    expect(response.status).toBe(400);
  });
});

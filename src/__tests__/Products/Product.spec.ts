import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import CreateProductService from '@modules/products/services/CreateProductService';
import Factories from '../factory/factories';
import DeleteTables from '../factory/deleteTables';

let connection: Connection;
describe('Product', () => {
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

  it('should create an product with valid credentials', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    const category = Factories.factoryCategory();
    customer.level_access = 1;
    const customerCreate = container.resolve(CreateCustomerService);
    const createCateg = container.resolve(CreateCategoryService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
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

  it('should not create an product if you are not an admin', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    const customerCreate = container.resolve(CreateCustomerService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });

    const response = await request(app)
      .post('/products')
      .send({
        name: productFactory.name,
        quantity: productFactory.quantity,
        price: productFactory.price,
        category_id: '438c351a-bf67-4c3d-8405-f078b32c5ecb',
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(401);
  });

  it('should not create an product with invalid credentials', async () => {
    const productFactory = Factories.factoryProduct();

    const response = await request(app)
      .post('/products')
      .send({
        name: productFactory.name,
        quantity: productFactory.quantity,
        price: productFactory.price,
        category_id: '438c351a-bf67-4c3d-8405-f078b32c5ecb',
      })
      .set('Authorization', `Bearer dusgdusgduisg`);

    expect(response.status).toBe(401);
  });

  it('should return all products with categtory', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    const category = Factories.factoryCategory();
    customer.level_access = 1;
    const customerCreate = container.resolve(CreateCustomerService);
    const createCateg = container.resolve(CreateCategoryService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name: productFactory.name,
      quantity: productFactory.quantity,
      price: productFactory.price,
      category_id: categoryCreate.id,
      role: customerAdmin.level_access,
    });

    const response = await request(app).get('/products');
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: product.name,
          quantity: product.quantity,
          price: String(product.price),
          category: {
            id: product.category.id,
            name: product.category.name,
          },
        }),
      ]),
    );
  });

  it('should return product with valid uuid', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    const category = Factories.factoryCategory();
    customer.level_access = 1;
    const customerCreate = container.resolve(CreateCustomerService);
    const createCateg = container.resolve(CreateCategoryService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name: productFactory.name,
      quantity: productFactory.quantity,
      price: productFactory.price,
      category_id: categoryCreate.id,
      role: customerAdmin.level_access,
    });
    const response = await request(app).get(`/products/${product.id}`);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: product.name,
        quantity: product.quantity,
        price: String(product.price),
        category: {
          id: product.category.id,
          name: product.category.name,
        },
      }),
    );
  });

  it('should update an product with valid credentials', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const category = Factories.factoryCategory();
    const customerCreate = container.resolve(CreateCustomerService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
    const createCateg = container.resolve(CreateCategoryService);
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name: productFactory.name,
      quantity: productFactory.quantity,
      price: productFactory.price,
      category_id: categoryCreate.id,
      role: customerAdmin.level_access,
    });

    const response = await request(app)
      .put(`/products/${product.id}`)
      .send({
        name: 'Teste',
        quantity: 4,
        price: 15.14,
        category_id: categoryCreate.id,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Teste',
        quantity: 4,
        price: 15.14,
        category: expect.objectContaining({
          id: categoryCreate.id,
          name: categoryCreate.name,
        }),
      }),
    );
  });

  it('should not update an product with invalid credentials', async () => {
    const response = await request(app)
      .put(`/products/438c351a-bf67-4c3d-8405-f078b32c5ecb`)
      .send({
        name: 'Teste',
        quantity: 4,
        price: 15.14,
        category_id: '438c351a-bf67-4c3d-8405-f078b32c5ecb',
      })
      .set('Authorization', `Bearer fsufgsufg`);

    expect(response.status).toBe(401);
  });

  it('should not update an product missing fields', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const category = Factories.factoryCategory();
    const customerCreate = container.resolve(CreateCustomerService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
    const createCateg = container.resolve(CreateCategoryService);
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name: productFactory.name,
      quantity: productFactory.quantity,
      price: productFactory.price,
      category_id: categoryCreate.id,
      role: customerAdmin.level_access,
    });

    const response = await request(app)
      .put(`/products/${product.id}`)
      .send({
        quantity: 4,
        price: 15.14,
        category_id: categoryCreate.id,
      })
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(400);
  });

  it('should delete an product with valid credentials', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const category = Factories.factoryCategory();
    const customerCreate = container.resolve(CreateCustomerService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
    const createCateg = container.resolve(CreateCategoryService);
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name: productFactory.name,
      quantity: productFactory.quantity,
      price: productFactory.price,
      category_id: categoryCreate.id,
      role: customerAdmin.level_access,
    });

    const response = await request(app)
      .delete(`/products/${product.id}`)
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(200);
  });

  it('should not delete an product with invalid credentials', async () => {
    const response = await request(app)
      .delete(`/products/438c351a-bf67-4c3d-8405-f078b32c5ecb`)
      .set('Authorization', `Bearer siofhsghsiuo`);

    expect(response.status).toBe(401);
  });

  it('should not delete an product with invalid uuid', async () => {
    const productFactory = Factories.factoryProduct();
    const customer = Factories.factoryCustomer();
    customer.level_access = 1;
    const category = Factories.factoryCategory();
    const customerCreate = container.resolve(CreateCustomerService);
    const customerAdmin = await customerCreate.execute({
      ...customer,
      role: 1,
    });
    const createCateg = container.resolve(CreateCategoryService);
    const categoryCreate = await createCateg.execute({
      name: category.name,
      role: customerAdmin.level_access,
    });
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name: productFactory.name,
      quantity: productFactory.quantity,
      price: productFactory.price,
      category_id: categoryCreate.id,
      role: customerAdmin.level_access,
    });

    const response = await request(app)
      .delete(`/products/${product.id}fshfus`)
      .set('Authorization', `Bearer ${await customerAdmin.session()}`);

    expect(response.status).toBe(400);
  });
});

import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/';
import app from '@shared/infra/http/app';
import { container } from 'tsyringe';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import Factories from '../factory/factories';
import DeleteTables from '../factory/deleteTables';

let connection: Connection;
describe('Address', () => {
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

  it('should create a address with valid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(200);
  });

  it('should not create a address with invalid credentials', async () => {
    const address = Factories.factoryAddress();
    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer 13213`);
    expect(createAddress.status).toBe(401);
  });

  it('should not create an address with missing fields', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(400);
  });

  it('should delete an address with valid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .delete(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(response.status).toBe(204);
  });

  it('should not delete an address with invalid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .delete(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .set('Authorization', `Bearer fksfi152`);
    expect(response.status).toBe(401);
  });

  it('should not delete an address if you are not the owner', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();

    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);
    const addCustomerOther = await createCustomer.execute({
      ...customer,
      email: 'test@test.com',
      cpf: '61132590307',
    });

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomerOther.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .delete(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(response.status).toBe(400);
  });

  it('should not delete an address with invalid uuid', async () => {
    const customer = Factories.factoryCustomer();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const response = await request(app)
      .delete(`/customers/addresses/14fsfsfs`)
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(response.status).toBe(400);
  });

  it('should update a address with valid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .put(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: 'Brazil',
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: 'Brazil',
        zipcode: address.zipcode,
      }),
    );
  });

  it('should not update a address with invalid credentials', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .put(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: 'Brazil',
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer 1212112`);

    expect(response.status).toBe(401);
  });

  it('should not update a address missing fields', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();
    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .put(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);

    expect(response.status).toBe(400);
  });

  it('should not update an address if you are not the owner', async () => {
    const customer = Factories.factoryCustomer();
    const address = Factories.factoryAddress();

    const createCustomer = container.resolve(CreateCustomerService);
    const addCustomer = await createCustomer.execute(customer);
    const addCustomerOther = await createCustomer.execute({
      ...customer,
      email: 'test@test.com',
      cpf: '61132590578',
    });

    const createAddress = await request(app)
      .post('/customers/addresses')
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomerOther.session()}`);
    expect(createAddress.status).toBe(200);

    const response = await request(app)
      .put(`/customers/addresses/${createAddress.body.addressCustomer.id}`)
      .send({
        address: address.address,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        country: 'Brazil',
        zipcode: address.zipcode,
      })
      .set('Authorization', `Bearer ${await addCustomer.session()}`);

    expect(response.status).toBe(400);
  });
});

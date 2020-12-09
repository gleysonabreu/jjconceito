import Customer from '@modules/customers/infra/typeorm/entities/Customer';

describe('Unitary Customer', () => {
  it('Encrypt password', async () => {
    const customer = new Customer();
    customer.password = '123456';
    await customer.encryptPassword();
    const encrypted = await customer.comparePassword('123456');

    expect(encrypted).toEqual(true);
  });
});

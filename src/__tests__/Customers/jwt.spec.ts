import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import Factories from '../factory/factories';

describe('Unitary Session', () => {
  it('Create JWT token', async () => {
    const customerInfo = Factories.factoryCustomer();
    const customer = new Customer();
    customer.firstname = customerInfo.firstname;
    customer.lastname = customerInfo.lastname;
    customer.email = customerInfo.email;
    const jwt = await customer.session();

    expect(jwt).toEqual(expect.any(String));
  });
});

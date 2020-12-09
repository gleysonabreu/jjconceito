import Customer from '../../typeorm/entities/Customer';

export default {
  render(customer: Customer) {
    return {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
      create_at: customer.created_at,
      updated_at: customer.updated_at,
    };
  },

  renderMany(customers: Customer[]) {
    return customers.map(customer => this.render(customer));
  },
};

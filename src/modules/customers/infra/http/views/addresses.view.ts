import Address from '../../typeorm/entities/Address';

export default {
  render(address: Address) {
    return {
      id: address.id,
      address: address.address,
      number: address.number,
      complement: address.complement,
      district: address.district,
      city: address.city,
      state: address.state,
      country: address.country,
      zipcode: address.zipcode,
      customer: {
        id: address.customer.id,
        firstname: address.customer.firstname,
        lastname: address.customer.lastname,
        email: address.customer.email,
        cpf: address.customer.cpf,
      },
    };
  },

  renderMany(addresses: Address[]) {
    return addresses.map(address => this.render(address));
  },
};

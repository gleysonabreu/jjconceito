import faker from 'faker';

export default {
  factoryCustomer() {
    return {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      cpf: '61125563250',
      level_access: 0,
    };
  },

  factoryAddress() {
    return {
      address: faker.address.streetAddress(),
      number: '888',
      complement: faker.address.secondaryAddress(),
      district: faker.address.county(),
      state: faker.address.state(),
      city: faker.address.city(),
      country: faker.address.country(),
      zipcode: faker.address.zipCode(),
    };
  },

  factoryCategory() {
    return { name: faker.name.findName() };
  },
};

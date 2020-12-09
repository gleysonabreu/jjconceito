import { container } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IAddressesRepository from '@modules/customers/repositories/IAddressesRepository';
import AddressesRepository from '@modules/customers/infra/typeorm/repositories/AddressesRepository';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

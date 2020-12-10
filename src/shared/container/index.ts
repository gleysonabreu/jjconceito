import { container } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IAddressesRepository from '@modules/customers/repositories/IAddressesRepository';
import AddressesRepository from '@modules/customers/infra/typeorm/repositories/AddressesRepository';

import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import CategoriesRepository from '@modules/products/infra/typeorm/repositories/CategoriesRepository';

import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import AdminsRepository from '@modules/admins/infra/typeorm/repositories/AdminsRepository';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<IAdminsRepository>(
  'AdminsRepository',
  AdminsRepository,
);

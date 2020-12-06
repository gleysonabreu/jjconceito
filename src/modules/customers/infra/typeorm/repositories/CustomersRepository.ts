import { getRepository, Repository } from 'typeorm';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../entities/Customer';

class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async create(customerUser: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create(customerUser);

    await customer.encryptPassword();
    await this.ormRepository.save(customer);
    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne(id);
    return findCustomer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return findCustomer;
  }

  public async findByCpf(cpf: string): Promise<Customer | undefined> {
    const findCustomer = await this.ormRepository.findOne({
      where: {
        cpf,
      },
    });

    return findCustomer;
  }

  public async update(customer: Customer): Promise<Customer> {
    const customerUpdated = await this.ormRepository.save({ ...customer });
    return customerUpdated;
  }
}

export default CustomersRepository;

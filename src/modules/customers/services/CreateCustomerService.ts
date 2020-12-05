import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  cpf: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(customerRequest: IRequest): Promise<Customer> {
    const customerExistsEmail = await this.customersRepository.findByEmail(
      customerRequest.email,
    );
    const customerExistsCpf = await this.customersRepository.findByCpf(
      customerRequest.cpf,
    );

    if (customerExistsCpf)
      throw new AppError('This CPF is already assigned to a customer.');
    if (customerExistsEmail)
      throw new AppError('This e-mail is already assigned to a customer');

    const customer = await this.customersRepository.create(customerRequest);
    return customer;
  }
}

export default CreateCustomerService;

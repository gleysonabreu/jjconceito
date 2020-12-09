import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
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
    const schema = Yup.object().shape({
      firstname: Yup.string().required().min(3),
      lastname: Yup.string().required().min(3),
      password: Yup.string().required().min(6),
      email: Yup.string().email().required().min(5),
      phone: Yup.string().required().min(10),
      cpf: Yup.string().required().min(11),
    });
    await schema.validate(customerRequest, { abortEarly: false });

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

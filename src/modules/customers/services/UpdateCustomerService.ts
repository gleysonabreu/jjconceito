import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  firstname: string;
  lastname: string;
  phone: string;
  id: string;
}

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    firstname,
    lastname,
    phone,
    id,
  }: IRequest): Promise<Customer> {
    const schema = Yup.object().shape({
      firstname: Yup.string().required().min(3),
      lastname: Yup.string().required().min(3),
      phone: Yup.string().required().min(10),
      id: Yup.string().uuid().required(),
    });
    await schema.validate(
      { firstname, lastname, phone, id },
      { abortEarly: false },
    );

    const customer = await this.customersRepository.findById(id);
    if (!customer) throw new AppError('Customer does not exist.');

    customer.firstname = firstname;
    customer.lastname = lastname;
    customer.phone = phone;

    const customerUpdated = await this.customersRepository.update(customer);
    return customerUpdated;
  }
}

export default UpdateCustomerService;

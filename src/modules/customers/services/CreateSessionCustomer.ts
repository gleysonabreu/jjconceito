import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class CreateSessionCustomer {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<string> {
    const customerExistsEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (!customerExistsEmail)
      throw new AppError('The email or password you entered is wrong.');

    if (!(await customerExistsEmail.comparePassword(password)))
      throw new AppError('The email or password you entered is wrong.');

    const token = await customerExistsEmail.session();

    return token;
  }
}

export default CreateSessionCustomer;

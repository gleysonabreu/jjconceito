import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
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
    const schema = Yup.object().shape({
      email: Yup.string().email().required().min(5),
      password: Yup.string().required().min(6),
    });
    await schema.validate({ email, password }, { abortEarly: false });

    const customerExistsEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (!customerExistsEmail)
      throw new AppError('The email or password you entered is wrong.', 401);

    if (!(await customerExistsEmail.comparePassword(password)))
      throw new AppError('The email or password you entered is wrong.', 401);

    const token = await customerExistsEmail.session();

    return token;
  }
}

export default CreateSessionCustomer;

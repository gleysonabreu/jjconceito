import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
import IAdminsRepository from '../repositories/IAdminsRepository';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class CreateSessionAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: IAdminsRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<string> {
    const schema = Yup.object().shape({
      email: Yup.string().required().min(1),
      password: Yup.string().required().min(6),
    });
    await schema.validate({ email, password }, { abortEarly: false });

    const admin = await this.adminsRepository.findByEmail(email);
    if (!admin)
      throw new AppError('This email or password you entered is wrong', 401);

    if (!(await admin.comparePassword(password)))
      throw new AppError('This email or password you entered is wrong', 401);

    const token = await admin.session();
    return token;
  }
}

export default CreateSessionAdminService;

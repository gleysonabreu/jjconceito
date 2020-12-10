import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Admin from '../infra/typeorm/entities/Admin';
import IAdminsRepository from '../repositories/IAdminsRepository';

interface IRequest {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  level_access: number;
  adminId: string;
}

@injectable()
class CreateAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: IAdminsRepository,
  ) {}

  public async execute({
    email,
    firstname,
    lastname,
    password,
    level_access,
    adminId,
  }: IRequest): Promise<Admin> {
    const schema = Yup.object().shape({
      email: Yup.string().required().min(2),
      firstname: Yup.string().required().min(1),
      lastname: Yup.string().required().min(1),
      password: Yup.string().required().min(6),
      level_access: Yup.number().integer().required().min(1),
      adminId: Yup.string().uuid().required(),
    });
    await schema.validate(
      {
        email,
        firstname,
        lastname,
        password,
        level_access,
        adminId,
      },
      { abortEarly: false },
    );

    const checkEmail = await this.adminsRepository.findByEmail(email);
    if (checkEmail) throw new AppError('This email already exists.');

    const admin = await this.adminsRepository.findById(adminId);
    if (!admin) throw new AppError('This admin does not exist.');

    if (admin.level_access !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError(
        'You do not have sufficient access to create new admins.',
      );

    const createAdmin = await this.adminsRepository.create({
      email,
      firstname,
      lastname,
      password,
      level_access,
    });

    return createAdmin;
  }
}

export default CreateAdminService;

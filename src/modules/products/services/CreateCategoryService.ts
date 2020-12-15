import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
import Category from '../infra/typeorm/entities/Category';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  role: number;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({ name, role }: IRequest): Promise<Category> {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(1),
      role: Yup.number().required(),
    });
    await schema.validate({ name, role }, { abortEarly: false });

    if (role !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError('You are not an admin', 401);

    const categoryExists = await this.categoriesRepository.findByName(name);
    if (categoryExists) throw new AppError('This category exists.');

    const category = await this.categoriesRepository.create({ name });
    return category;
  }
}

export default CreateCategoryService;

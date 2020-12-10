import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
import Category from '../infra/typeorm/entities/Category';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Category> {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(1),
    });
    await schema.validate({ name }, { abortEarly: false });

    const categoryExists = await this.categoriesRepository.findByName(name);
    if (categoryExists) throw new AppError('This category exists.');

    const category = await this.categoriesRepository.create({ name });
    return category;
  }
}

export default CreateCategoryService;

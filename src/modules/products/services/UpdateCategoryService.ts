import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
import ICategoriesRepository from '../repositories/ICategoriesRepository';
import Category from '../infra/typeorm/entities/Category';

interface IRequest {
  id: string;
  name: string;
  role: number;
}

@injectable()
class UpdateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ id, name, role }: IRequest): Promise<Category> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
      name: Yup.string().required(),
      role: Yup.number().required(),
    });
    await schema.validate({ id, name, role }, { abortEarly: false });

    if (role !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError('You are not an admin.', 401);

    const categoryCheckId = await this.categoriesRepository.show(id);
    if (!categoryCheckId) throw new AppError('This category does not exist.');

    const categoryCheckName = await this.categoriesRepository.findByName(name);
    if (categoryCheckName)
      throw new AppError('This category name already exists.');

    categoryCheckId.name = name;
    const categoryUpdated = await this.categoriesRepository.update(
      categoryCheckId,
    );
    return categoryUpdated;
  }
}

export default UpdateCategoryService;

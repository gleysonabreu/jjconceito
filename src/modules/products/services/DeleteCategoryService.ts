import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

interface IRequest {
  id: string;
  role: number;
}

@injectable()
class DeleteCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ id, role }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
      role: Yup.number().required(),
    });
    await schema.validate({ id, role }, { abortEarly: false });

    if (role !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError('You are not an admin.', 401);

    const categoryCheckId = await this.categoriesRepository.show(id);
    if (!categoryCheckId) throw new AppError('This category does not exist.');

    await this.categoriesRepository.delete(categoryCheckId);
  }
}

export default DeleteCategoryService;

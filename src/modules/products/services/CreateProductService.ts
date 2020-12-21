import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Product from '../infra/typeorm/entities/Product';
import ICategoriesRepository from '../repositories/ICategoriesRepository';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
  category_id: string;
  role: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CategoriesRepository')
    private categoryRepository: ICategoriesRepository,
  ) {}

  async execute({
    name,
    price,
    quantity,
    role,
    category_id,
  }: IRequest): Promise<Product> {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(3),
      price: Yup.number().required(),
      quantity: Yup.number().required().min(1),
      role: Yup.number().required(),
      category_id: Yup.string().uuid().required(),
    });
    await schema.validate(
      { name, price, quantity, role, category_id },
      { abortEarly: false },
    );

    if (role !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError('You are not an admin.', 401);

    const category = await this.categoryRepository.show(category_id);
    if (!category) throw new AppError('This category does not exist.');

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
      category,
    });
    return product;
  }
}

export default CreateProductService;

import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Product from '../infra/typeorm/entities/Product';
import ICategoriesRepository from '../repositories/ICategoriesRepository';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category_id: string;
  role: number;
}

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(request: IRequest): Promise<Product> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
      name: Yup.string().required().min(1),
      price: Yup.number().required(),
      quantity: Yup.number().required().min(1),
      category_id: Yup.string().uuid().required(),
      role: Yup.number().required(),
    });
    await schema.validate(request, { abortEarly: false });

    if (request.role !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError('You are not an admin.');

    const product = await this.productsRepository.show(request.id);
    if (!product) throw new AppError('This product does not exist');

    const category = await this.categoriesRepository.show(request.category_id);
    if (!category) throw new AppError('This category does not exist.');

    product.name = request.name;
    product.price = request.price;
    product.quantity = request.quantity;
    product.category = category;

    const productUpdated = await this.productsRepository.update(product);
    return productUpdated;
  }
}

export default UpdateProductService;

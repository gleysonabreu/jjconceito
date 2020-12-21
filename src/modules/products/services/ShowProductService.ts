import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
}

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({ id }: IRequest): Promise<Product> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
    });
    await schema.validate({ id }, { abortEarly: false });

    const product = await this.productsRepository.show(id);
    if (!product) throw new AppError('This product does not exist.');

    return product;
  }
}

export default ShowProductService;

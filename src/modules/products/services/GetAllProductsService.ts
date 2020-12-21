import { inject, injectable } from 'tsyringe';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
class GetAllProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute(): Promise<Product[]> {
    const products = await this.productsRepository.getAll();
    if (!products) return [];

    return products;
  }
}

export default GetAllProductsService;

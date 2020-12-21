import { getRepository, Repository } from 'typeorm';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProducyDTO from '@modules/products/dtos/ICreateProducyDTO';
import Product from '../entities/Product';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async delete(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async update(product: Product): Promise<Product> {
    const saveProduct = await this.ormRepository.save({ ...product });
    return saveProduct;
  }

  public async show(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id, {
      relations: ['category'],
    });
    return product;
  }

  public async getAll(): Promise<Product[] | undefined> {
    const products = await this.ormRepository.find({
      relations: ['category'],
    });
    return products;
  }

  public async create(productData: ICreateProducyDTO): Promise<Product> {
    const product = this.ormRepository.create(productData);
    await this.ormRepository.save(product);
    return product;
  }
}

export default ProductsRepository;

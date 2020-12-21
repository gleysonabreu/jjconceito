import ICreateProducyDTO from '../dtos/ICreateProducyDTO';
import Product from '../infra/typeorm/entities/Product';

export default interface IProductsRepository {
  create(product: ICreateProducyDTO): Promise<Product>;
  getAll(): Promise<Product[] | undefined>;
  show(id: string): Promise<Product | undefined>;
  update(product: Product): Promise<Product>;
  delete(product: Product): Promise<void>;
}

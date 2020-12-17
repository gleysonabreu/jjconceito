import ICreateProducyDTO from '../dtos/ICreateProducyDTO';
import Product from '../infra/typeorm/entities/Product';

export default interface IProductsRepository {
  create(product: ICreateProducyDTO): Promise<Product>;
}

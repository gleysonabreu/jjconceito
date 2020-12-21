import Category from '../infra/typeorm/entities/Category';

export default interface ICreateProducyDTO {
  name: string;
  price: number;
  quantity: number;
  category: Category;
}

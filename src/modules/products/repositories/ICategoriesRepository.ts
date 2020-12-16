import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';
import Category from '../infra/typeorm/entities/Category';

export default interface ICategoriesRepository {
  show(id: string): Promise<Category | undefined>;
  findByName(name: string): Promise<Category | undefined>;
  create(category: ICreateCategoryDTO): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(category: Category): Promise<void>;
}

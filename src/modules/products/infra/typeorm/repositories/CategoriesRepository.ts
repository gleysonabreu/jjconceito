import ICreateCategoryDTO from '@modules/products/dtos/ICreateCategoryDTO';
import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import { getRepository, Repository } from 'typeorm';
import Category from '../entities/Category';

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create(categoryCreate: ICreateCategoryDTO): Promise<Category> {
    const createCategory = this.ormRepository.create(categoryCreate);
    const category = await this.ormRepository.save(createCategory);
    return category;
  }

  public async findByName(name: string): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return category;
  }

  public async show(id: string): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne(id, {
      relations: ['products'],
    });

    return category;
  }
}

export default CategoriesRepository;

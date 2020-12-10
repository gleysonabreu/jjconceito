import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import ShowCategoryService from '@modules/products/services/ShowCategoryService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class CategoriesController {
  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showCategoryService = container.resolve(ShowCategoryService);
    const category = await showCategoryService.execute({ id });

    return response.json(category);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCategoryService = container.resolve(CreateCategoryService);
    const category = await createCategoryService.execute({ name });
    return response.json(category);
  }
}

export default CategoriesController;

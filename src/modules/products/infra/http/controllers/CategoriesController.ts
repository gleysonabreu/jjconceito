import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import ShowCategoryService from '@modules/products/services/ShowCategoryService';
import UpdateCategoryService from '@modules/products/services/UpdateCategoryService';
import DeleteCategoryService from '@modules/products/services/DeleteCategoryService';

class CategoriesController {
  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCategory = container.resolve(DeleteCategoryService);
    await deleteCategory.execute({
      id,
      role: Number(request.role),
    });
    return response.sendStatus(200);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name } = request.body;

    const updateCategoryService = container.resolve(UpdateCategoryService);
    const category = await updateCategoryService.execute({
      id,
      name,
      role: Number(request.role),
    });
    return response.json(category);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showCategoryService = container.resolve(ShowCategoryService);
    const category = await showCategoryService.execute({ id });

    return response.json(category);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCategoryService = container.resolve(CreateCategoryService);
    const category = await createCategoryService.execute({
      name,
      role: Number(request.role),
    });
    return response.json(category);
  }
}

export default CategoriesController;

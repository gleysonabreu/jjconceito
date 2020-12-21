import CreateProductService from '@modules/products/services/CreateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import GetAllProductsService from '@modules/products/services/GetAllProductsService';
import ShowProductService from '@modules/products/services/ShowProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProductController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, quantity, price, category_id } = request.body;
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      quantity,
      price,
      role: Number(request.role),
      category_id,
    });
    return response.json(product);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const getAllProductsService = container.resolve(GetAllProductsService);
    const products = await getAllProductsService.execute();
    return response.json(products);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showProductService = container.resolve(ShowProductService);
    const product = await showProductService.execute({ id });

    return response.json(product);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, quantity, price, category_id } = request.body;

    const updateProductService = container.resolve(UpdateProductService);
    const product = await updateProductService.execute({
      id,
      name,
      quantity,
      price,
      category_id,
      role: Number(request.role),
    });

    return response.json(product);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteProductService = container.resolve(DeleteProductService);
    await deleteProductService.execute({
      id,
      role: Number(request.role),
    });

    return response.sendStatus(200);
  }
}

export default ProductController;

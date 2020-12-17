import CreateProductService from '@modules/products/services/CreateProductService';
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
}

export default ProductController;

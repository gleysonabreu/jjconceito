import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
  role: number;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute(request: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      id: Yup.string().uuid().required(),
      role: Yup.number().required(),
    });
    await schema.validate(request, { abortEarly: false });

    if (request.role !== Number(process.env.ADMIN_ACCESS_LEVEL))
      throw new AppError('You are not an admin');

    const product = await this.productsRepository.show(request.id);
    if (!product) throw new AppError('This product does not exist');

    await this.productsRepository.delete(product);
  }
}

export default DeleteProductService;

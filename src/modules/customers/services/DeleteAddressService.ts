import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IAddressesRepository from '../repositories/IAddressesRepository';

interface IRequest {
  id: string;
  customerId: string;
}

@injectable()
class DeleteAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({ id, customerId }: IRequest): Promise<void> {
    const address = await this.addressesRepository.findById(id);

    if (!address) throw new AppError('This address does not exist.');

    if (address.customer.id !== customerId)
      throw new AppError('This address is not yours for you to delete.');

    await this.addressesRepository.delete(id);
  }
}

export default DeleteAddressService;

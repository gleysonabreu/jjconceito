import { inject, injectable } from 'tsyringe';
import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';

interface IRequest {
  address: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  customer: {
    id: string;
  };
}

@injectable()
class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(addressCustomer: IRequest): Promise<Address> {
    const address = await this.addressesRepository.create(addressCustomer);
    return address;
  }
}

export default CreateAddressService;

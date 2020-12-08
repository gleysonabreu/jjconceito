import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '@shared/errors/AppError';
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
  id: string;
  customerId: string;
}

@injectable()
class UpdateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(addressUpdate: IRequest): Promise<Address> {
    const schema = Yup.object().shape({
      address: Yup.string().required().min(3),
      number: Yup.string().required().min(1),
      complement: Yup.string(),
      district: Yup.string().required().min(1),
      city: Yup.string().required().min(1),
      state: Yup.string().required().min(1),
      country: Yup.string().required().min(1),
      zipcode: Yup.string().required().min(1),
      id: Yup.string().uuid().required(),
      customerId: Yup.string().uuid().required(),
    });
    await schema.validate(addressUpdate, { abortEarly: false });

    const address = await this.addressesRepository.findById(addressUpdate.id);
    if (!address) throw new AppError('This address does not exist.');

    if (address.customer.id !== addressUpdate.customerId)
      throw new AppError('This address is not yours for you to edit.');

    address.address = addressUpdate.address;
    address.city = addressUpdate.city;
    address.state = addressUpdate.state;
    address.zipcode = addressUpdate.zipcode;
    address.country = addressUpdate.country;
    address.district = addressUpdate.district;
    address.number = addressUpdate.number;
    address.complement = addressUpdate.complement;

    const addressUpdated = await this.addressesRepository.update(address);
    return addressUpdated;
  }
}

export default UpdateAddressService;

import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
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
    const schema = Yup.object().shape({
      address: Yup.string().required().min(3),
      number: Yup.string().required().min(1),
      complement: Yup.string(),
      district: Yup.string().required().min(1),
      city: Yup.string().required().min(1),
      state: Yup.string().required().min(1),
      zipcode: Yup.string().required().min(1),
      country: Yup.string().required().min(1),
      customer: Yup.object({
        id: Yup.string().uuid().required().min(1),
      }),
    });
    await schema.validate(addressCustomer, { abortEarly: false });

    const address = await this.addressesRepository.create(addressCustomer);
    return address;
  }
}

export default CreateAddressService;

import ICreateAddressDTO from '../dtos/ICreateAddressDTO';
import Address from '../infra/typeorm/entities/Address';

export default interface IAddressesRepository {
  create(address: ICreateAddressDTO): Promise<Address>;
}

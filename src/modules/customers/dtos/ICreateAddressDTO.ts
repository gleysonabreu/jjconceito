export default interface ICreateAddressDTO {
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

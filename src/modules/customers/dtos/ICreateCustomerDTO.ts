export default interface ICreateCustomerDTO {
  firstname: string;
  lastname: string;
  password: string;
  phone: string;
  email: string;
  cpf: string;
  level_access?: number;
}

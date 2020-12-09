import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Customer from './Customer';

@Entity('addresses')
class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  number: string;

  @Column()
  complement: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zipcode: string;

  @ManyToOne(() => Customer, customer => customer.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}

export default Address;

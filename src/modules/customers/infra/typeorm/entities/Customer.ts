import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Address from './Address';

@Entity('customers')
class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cpf: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Address, address => address.customer, {
    cascade: ['update', 'insert'],
  })
  @JoinColumn({ name: 'customer_id' })
  addresses: Address[];

  public async session(): Promise<string> {
    return jwt.sign(
      {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        id: this.id,
      },
      String(process.env.JWT_SECRET_TOKEN),
      {
        expiresIn: '1h',
      },
    );
  }

  public async encryptPassword(): Promise<void> {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );
  }

  public async comparePassword(password: string): Promise<boolean> {
    const comparePass = await bcrypt.compare(password, this.password);
    return comparePass;
  }
}

export default Customer;

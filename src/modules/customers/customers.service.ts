import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customers.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, user?: Express.User) {
    console.log(user);
    if (user.type !== 'ADMIN') {
      throw new BadRequestException('Only admins can create customers');
    }

    const emailExists = await this.customerModel.findOne({
      email: createCustomerDto.email,
    });

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const customer = new this.customerModel({
      ...createCustomerDto,
      outstandingBalance: 0,
    });
    return customer.save();
  }

  async findAll(query: any = {}) {
    console.log('hi');
    const { search, sort = 'name', order = 'asc', isActive } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const allCustomers = await this.customerModel
      .find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .exec();
    console.log(allCustomers);
    return allCustomers.map((customer) => ({
      ...customer.toObject(),
    }));
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    user: Express.User,
  ) {
    if (user.type !== 'ADMIN') {
      throw new BadRequestException('Only admins can update customers');
    }

    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const emailExists = await this.customerModel.findOne({
        email: updateCustomerDto.email,
      });
      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return customer.save();
  }

  async remove(id: string, user: Express.User) {
    if (user.type !== 'ADMIN') {
      throw new BadRequestException('Only admins can delete customers');
    }

    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    if (customer.outstandingBalance > 0) {
      throw new BadRequestException(
        'Cannot delete customer with outstanding balance',
      );
    }

    await this.customerModel.deleteOne({ _id: id });
    return customer;
  }

  async updateBalance(
    id: string,
    amount: number,
    isCredit: boolean,
    user: Express.User,
  ) {
    if (user.type !== 'ADMIN') {
      throw new BadRequestException('Only admins can update customer balance');
    }

    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const newBalance = isCredit
      ? customer.outstandingBalance + amount
      : customer.outstandingBalance - amount;

    if (newBalance < 0) {
      throw new BadRequestException('Invalid payment amount');
    }

    customer.outstandingBalance = newBalance;
    return customer.save();
  }
}

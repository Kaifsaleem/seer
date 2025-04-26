import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import CtmPost from '../../common/decorators/post.decorator';
import CtmAuth from '../../common/decorators/auth.decorator';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @Post()
  // @CtmPost()
  @CtmAuth()
  create(@Body() createDto: CreateCustomerDto, @Req() req: any) {
    return this.customersService.create(createDto, req.auth?.user);
  }

  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers' })
  @Get()
  @CtmAuth()
  findAll(@Query() query: any) {
    return this.customersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Return the customer' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCustomerDto,
    @Req() req: any,
  ) {
    return this.customersService.update(id, updateDto, req.user);
  }

  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.customersService.remove(id, req.user);
  }

  @ApiOperation({ summary: 'Update customer balance' })
  @ApiResponse({ status: 200, description: 'Balance updated successfully' })
  @Put(':id/balance')
  updateBalance(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('isCredit') isCredit: boolean,
    @Req() req: any,
  ) {
    return this.customersService.updateBalance(id, amount, isCredit, req.user);
  }
}

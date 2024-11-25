import { Controller, Body } from '@nestjs/common';
import { Get, Patch, Param, Delete, Request } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExRequest } from 'express';
import CtmPost from '../../common/decorators/post.decorator';
import CtmAuth from 'src/common/decorators/auth.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description Create a new user
   */
  @ApiOkResponse({ description: 'Create a new user', type: CreateUserDto })
  @CtmPost()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * @description Get user profile
   */
  // @ApiOkResponse({ description: 'Get user profile', type: CreateUserDto })
  // @CtmAuth()
  // @Get('profile')
  // getProfile(@Request() req: ExRequest) {
  //   console.log(Object.keys(req));
  //   return this.usersService.findById(req.auth.user.id);
  // }

  /**
   * @description Get user profile
   */
  // @ApiOkResponse({ description: 'Get user profile', type: CreateUserDto })
  // @CtmAuth()
  // @Get('admin')
  // getProfileAdmin(@Request() req: ExRequest) {
  //   console.log('here');
  //   return this.usersService.findById(req.auth.user.id);
  // }

  @Get()
  @CtmAuth()
  findAll(@Request() req: ExRequest) {
    const user = req.auth?.user;
    return this.usersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: ExRequest) {
    const user = req.auth?.user;
    return this.usersService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExRequest,
  ) {
    const user = req.auth?.user;
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: ExRequest) {
    const user = req.auth?.user;
    return this.usersService.remove(id, user);
  }
}

import { Controller, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import { Request as ExRequest } from 'express';
import CtmPost from '../../common/decorators/post.decorator';

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

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}

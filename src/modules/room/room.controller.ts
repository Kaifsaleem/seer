import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
// import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags } from '@nestjs/swagger';
import CtmAuth from '../../common/decorators/auth.decorator';
import { Request as ExRequest } from 'express';
import { Request } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('room')
@ApiTags('room')
@CtmAuth()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create a new Floor',
    type: CreateRoomDto,
  })
  async create(
    @Request() req: ExRequest,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    const user = req.auth?.user;
    return this.roomService.create(createRoomDto, user);
  }

  @Get()
  findAll(@Request() req: ExRequest) {
    const user = req.auth?.user;
    return this.roomService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req: ExRequest) {
    const user = req.auth?.user;
    return this.roomService.findOne(user, id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomService.update(+id, updateRoomDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { Request as ExRequest } from 'express';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
// import { UpdateFloorDto } from './dto/update-floor.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import CtmAuth from '../../common/decorators/auth.decorator';

@Controller('floors')
@ApiTags('floors')
@CtmAuth()
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create a new Floor',
    type: CreateFloorDto,
  })
  async create(
    @Request() req: ExRequest,
    @Body() createFloorDto: CreateFloorDto,
  ) {
    const user = req.auth?.user;
    return this.floorService.create(createFloorDto, user);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'new Floor',
    type: CreateFloorDto,
  })
  findAllfloors() {
    return this.floorService.findAll();
  }

  @Get(':floor')
  @ApiCreatedResponse({
    description: 'Floor',
    type: CreateFloorDto,
  })
  findOne(@Param('floor') floor: number) {
    return this.floorService.findOneByFloorNumber(floor);
  }

  // @Patch(':id')
  // @ApiCreatedResponse({
  //   description: 'update Floor',
  //   type: UpdateFloorDto,
  // })
  // update(@Param('id') id: string, @Body() updateFloorDto: UpdateFloorDto) {
  //   return this.floorService.update(id, updateFloorDto);
  // }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'delete Floor',
    type: CreateFloorDto,
  })
  remove(@Param('id') id: string) {
    return this.floorService.remove(id);
  }
}

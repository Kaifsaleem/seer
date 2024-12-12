import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Floor, FloorSchema } from '../floor/floor.schema';
import { Room, RoomSchema } from './room.schema';

@Module({
  imports: [
    // Import floor schema here

    MongooseModule.forFeature([{ name: Floor.name, schema: FloorSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}

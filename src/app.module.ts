import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigProvider } from './global/providers/config.provider';
import MongooseConnProvider from './global/providers/mongooseConn.provider';
import EventEmitterProvider from './global/providers/eventEmmiter.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { FloorModule } from './modules/floor/floor.module';
import { DailyTaskModule } from './modules/daily-task/daily-task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigProvider,
    MongooseConnProvider,
    ScheduleModule.forRoot(),
    EventEmitterProvider,
    AuthModule,
    UsersModule,
    FloorModule,
    DailyTaskModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

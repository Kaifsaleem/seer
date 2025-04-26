import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigProvider } from './global/providers/config.provider';
import MongooseConnProvider from './global/providers/mongooseConn.provider';
import EventEmitterProvider from './global/providers/eventEmmiter.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CustomersModule } from './modules/customers/customers.module';
import { ConsultantModule } from './modules/consultant/consultant.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigProvider,
    MongooseConnProvider,
    ScheduleModule.forRoot(),
    EventEmitterProvider,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    AuthModule,
    UsersModule,
    CustomersModule,
    ConsultantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

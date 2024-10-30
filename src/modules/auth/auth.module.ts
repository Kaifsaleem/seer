import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import JwtProvider from './providers/jwt.provider';
import { AbilityModule } from '../ability/ability.module';

/**
 * The AuthModule is a global module that provides the AuthService.
 * Since the AuthService is used in the AuthGuard, we need to export
 * it so that it can be used in other modules.
 */
@Global()
@Module({
  imports: [JwtProvider, SessionsModule, UsersModule, AbilityModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

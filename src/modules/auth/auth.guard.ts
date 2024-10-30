import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.auth.isAuthenticated) {
      throw new UnauthorizedException(
        'Looks like you are not authenticated. Please log in.',
      );
    }

    return true;
  }
}

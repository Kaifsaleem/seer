import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

/**
### Documentation

#### **Purpose:**

The `AuthMiddleware` is designed to handle authentication for incoming HTTP requests in a NestJS application. It intercepts requests, extracts and verifies JWT tokens, and determines if the request is from an authenticated user. This middleware is essential in securing routes by ensuring that only users with valid tokens can access protected resources.

#### **When to Use:**

- **Securing Routes:** Use this middleware when you need to protect specific routes or resources in your application, ensuring that only authenticated users can access them.
- **Token Validation:** It is ideal when you want to validate JWT tokens for authenticity and integrity, as well as to check for an active session.
- **User Context:** This middleware is useful when you need to pass the authenticated user's information (such as roles) along with the request for subsequent processing in controllers or other middleware.

#### **How It Works:**

1. **Token Extraction:** The middleware first attempts to extract a token from the `Authorization` header of the incoming request. It expects the token to be in the format `Bearer <token>`.
  
2. **Token Verification:** The extracted token is then verified using the `JwtService` provided by NestJS, with the secret key fetched from the configuration service (`ConfigService`).

3. **Session Validation:** After successful verification, the middleware checks if there is an active session for the user by querying the `AuthService` with the user ID (extracted from the token's payload).

4. **Authentication Context:** If the session is valid, the middleware flags the request as authenticated and attaches the user's information (including roles) to the request object for further use.

5. **Error Handling:** If any step in the token extraction, verification, or session validation fails, the middleware silently proceeds without authenticating the request. This allows the request to move forward but as unauthenticated.

#### **Requirements:**

- **JwtService:** Required for decoding and verifying the JWT token. Ensure it is configured properly with the correct secret key.
- **ConfigService:** Used to fetch environment-specific configurations like the JWT secret key.
- **AuthService:** Needed to verify the session's validity based on the user's information extracted from the token.
  
#### **Code Requirements:**

- **NestMiddleware:** The class implements `NestMiddleware`, which is necessary for any middleware in a NestJS application.
- **NestJS Decorators:** The `@Injectable()` decorator is used to register the middleware as a service within the NestJS dependency injection system.

#### **Usage Example:**

To apply the `AuthMiddleware` to a specific route or set of routes, you would typically do this in a module file:

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  // ...other imports and module settings
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('protected-route');
  }
}
```

This example shows how to apply the `AuthMiddleware` to the route `protected-route`, ensuring that it only allows requests from authenticated users.

---

This documentation should provide clarity on when and why to use `AuthMiddleware`, along with the required setup and context.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
  ) { }
  async use(req: Request, res: Response, next: NextFunction) {
    const auth: Express.Auth = {
      isAuthenticated: false,
    };
    req['auth'] = auth;
    try {
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        return next();
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('jwt.secret'),
      });

      const session = await this.authService.checkSession(payload.sub);
      if (!session) {
        return next();
      }
      const user = await this.usersService.findById(payload.user.id);

      if (!user) {
        return next();
      }

      auth.isAuthenticated = true;
      auth.user = payload.user;
      auth.sub = payload.sub;
      auth.iat = payload.iat;
      auth.exp = payload.exp;

      auth.user.type = user.type;
      req['auth'] = auth;//value of auth is stored in req object and change it if user is authenticated
    } catch (error) { }

    return next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

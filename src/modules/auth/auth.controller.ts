import {
  Body,
  Controller,
  Request,
  Delete,
  Get,
  Param,
  Query,
  // Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiCreatedResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
// import { Request as ExRequest } from 'express';
import CtmPost from '../../common/decorators/post.decorator';
import { Request as ExRequest } from 'express';
import CtmAuth from '../../common/decorators/auth.decorator';
import CtmApiGetResponse from '../../common/decorators/apiGet.decorator';
import CtmApiAcceptedResponseC from '../../common/decorators/apiAccepted.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description Create new session
   */
  @CtmPost()
  @ApiCreatedResponse({
    description: 'Login successful',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(LoginDto),
        },
        {
          properties: {
            user: {
              $ref: getSchemaPath(CreateUserDto),
            },
          },
        },
      ],
    },
  })
  login(@Body() loginDto: LoginDto, @Request() req: ExRequest) {
    // assign ip and user agent
    if (!loginDto.ip) {
      loginDto.ip = req.ip;
    }

    if (!loginDto.userAgent) {
      loginDto.userAgent = req.headers['user-agent'];
    }

    return this.authService.signIn(loginDto);
  }

  /**
   * @description Get Active Sessions
   */

  @Get()
  @CtmAuth()
  @CtmApiGetResponse({
    description: 'Get a list of active sessions',
    schema: getSchemaPath(LoginDto),
  })
  async getSession(@Request() req: ExRequest) {
    return this.authService.checkSession(req.auth.sub);
  }

  @Get('sessions')
  @CtmAuth()
  @CtmApiGetResponse({
    description: 'Get a list of active sessions',
    schema: getSchemaPath(LoginDto),
  })
  async getSessions(
    @Request() req: ExRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.authService.getSessions(req.auth.user.id, +page, +limit);
  }

  /**
   * @description Delete Current Session
   */
  @Delete()
  @CtmAuth()
  @CtmApiAcceptedResponseC({ description: 'Logged out successfully' })
  async logout(@Request() req: ExRequest) {
    await this.authService.deleteSession(req.auth.sub, req.auth.user);
  }

  /**
   * @description Delete Session by ID
   */
  @Delete(':id')
  @CtmAuth()
  @CtmApiAcceptedResponseC({ description: 'Session revoked successfully' })
  async logoutById(@Request() req: ExRequest, @Param('id') id: string) {
    // TODO: need to make casl policy for this
    await this.authService.deleteSession(id, req.auth.user);
  }
}

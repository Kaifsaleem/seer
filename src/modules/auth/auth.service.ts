import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AbilityFactory } from '../ability/ability.factory';
import { SessionsService } from '../sessions/sessions.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';

type loginMethods = 'local';

@Injectable()
export class AuthService {
  constructor(
    // private readonly sessionsRepository: Repository<Session>,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  private async createSession(
    userId: string,
    method: loginMethods = 'local',
    loginDto: LoginDto,
  ) {
    return this.sessionsService.create({
      userId,
      ip: loginDto.ip,
      userAgent: loginDto.userAgent,
      method,
      type: 'access',
    });
  }

  async getSessions(userId: string, page = 1, limit = 10) {
    const sessions = await this.sessionsService.getValidSessions(
      userId,
      page,
      limit,
    );
    return sessions;
  }

  checkSession(id: string) {
    return this.sessionsService.validateSession(id);
  }

  async signIn(loginDto: LoginDto): Promise<any> {
    const { login, password } = loginDto;
    const user = await this.usersService.findByEmail(login);
    if (!user) {
      // Email not found
      throw new BadRequestException('Email or password is incorrect');
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      // Password is incorrect
      this.eventEmitter.emit('auth.signIn.failed', user, loginDto);
      throw new BadRequestException('Email or password is incorrect');
    }

    const session = await this.createSession(user.id, 'local', loginDto);
    const { id } = user;

    // instead of the user object
    const payload = { sub: session.id, user: { id, login } };

    this.eventEmitter.emit('auth.signIn.success', session, user);

    return {
      token: await this.jwtService.signAsync(payload),
      user: user.toObject(),
    };
  }

  async deleteSession(sessionId: string, user: Express.User) {
    const ability = this.abilityFactory.createForUser(user);
    const session = await this.sessionsService.validateSession(sessionId);

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    // Check if user can delete selected session
    if (!ability.can('delete', session)) {
      throw new BadRequestException(
        'You are not authorized to delete this session',
      );
    }

    const result = await this.sessionsService.invalidateSession(sessionId);

    return result;
  }
}

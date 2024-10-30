import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const JwtProvider = JwtModule.registerAsync({
  global: true,
  imports: [],
  useFactory: async (config: ConfigService) => {
    const secret = config.getOrThrow('jwt.secret');
    const expiresIn = config.getOrThrow('jwt.expiresIn');
    return {
      secret,
      signOptions: { expiresIn },
    };
  },
  inject: [ConfigService],
});

export default JwtProvider;

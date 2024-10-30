import { ConfigModule } from '@nestjs/config';
import config from '../config';

export const ConfigProvider = ConfigModule.forRoot({
  isGlobal: true,
  cache: true,
  envFilePath: ['.env.local'],
  load: [config],
});

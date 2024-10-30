import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const MongooseConnProvider = MongooseModule.forRootAsync({
  imports: [],
  useFactory: async (config: ConfigService) => {
    return {
      uri: config.get('database.connectionString'),
      dbName: config.get('database.masterDBName'),
    };
  },
  inject: [ConfigService],
});

export default MongooseConnProvider;

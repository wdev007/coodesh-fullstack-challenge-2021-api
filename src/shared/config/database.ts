import * as dotenv from 'dotenv';
import * as path from 'path';

import { ConfigService } from '@nestjs/config';

const CONFIG_PATH: string = path.resolve(
  process.cwd(),
  `.env.${process.env.NODE_ENV}`,
);

dotenv.config({ path: CONFIG_PATH });

const mongoFactory = async (configService: ConfigService) => ({
  uri: configService.get('MONGODB_URI'),
});

export default () => ({
  mongoFactory,
});

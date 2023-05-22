require('dotenv').config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import { LogLevel } from '@nestjs/common';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { config } from './config';
import { parse } from './json-util';

const logger: Logger = new Logger('Main');

const port = process.env.NODE_SERVER_PORT || config.get('server.port');

const generateSwagger = Boolean(parse(process.env.GENERATE_SWAGGER ?? "false", () => false));

async function bootstrap(): Promise<void> {

  if (!process.env.CHROMIUM_EXECUTABLE_PATH) {
    console.error("CHROMIUM_EXECUTABLE_PATH is required to run damages report");
  }
  const logLevel =
    (process.env.LOG_LEVEL?.split(',') as LogLevel[]) ??
    (['log', 'debug', 'error', 'verbose', 'warn'] as LogLevel[]);

  const appOptions = {
    cors: {
      exposedHeaders: ['X-Total-Count', 'ConfigsUpdatedAt'],
      origin: true
    },
    logger: logLevel,
  };
  const app = await NestFactory.create(AppModule, appOptions);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (generateSwagger) {
    logger.log('Creating Swagger');
    require('./swagger').setupSwagger(app);
  }
  logger.log('No client it has been found');

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  if (process.send) {
    process.send('ready');
  }
}
bootstrap().catch(e => {
  logger.log(e);
  throw e;
});


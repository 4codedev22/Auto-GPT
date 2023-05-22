import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from './config';

export function setupSwagger(app: INestApplication): any {
    const logger: Logger = new Logger('Swagger');
    const swaggerEndpoint = config.get('mobfleet.swagger.path');

    const options = new DocumentBuilder()
        .setTitle(config.get('mobfleet.swagger.title'))
        .setDescription(config.get('mobfleet.swagger.description'))
        .setVersion(config.get('mobfleet.swagger.version'))
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerEndpoint, app, document);
    logger.log(`Added swagger on endpoint ${swaggerEndpoint}`);
    return document;
}

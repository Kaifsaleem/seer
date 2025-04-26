import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './global/filters/exception.filter';
// import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Enable CORS
  // app.use(cors());
  app.enableCors();

  /**
   * This interceptor will ensure that the response is serialized, and any property that is marked with @Exclude() in the Entity will not be included in the response.
   */
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Imutual fund rag system')
    .setDescription('API Documentation for mutual fund rag system')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Inventory')
    .addTag('Customers')
    .addTag('Invoices')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('docs', app, document, swaggerOptions);

  await app.listen(4006);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

import { ClassSerializerInterceptor, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  // exclude routes from serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  // validation pipe validation dto response
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const response = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: {},
          error: HttpStatus[HttpStatus.BAD_REQUEST],
        };
        //config structure errors
        errors.forEach((error) => {
          const field = error.property;
          const constraints = Object.values(error.constraints);
          response.message[field] = constraints[0];
        });

        return response;
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();

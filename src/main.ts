import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT', 3000);

  await app.listen(process.env.PORT ?? 3000);

  await app.listen(port);
  console.info(`API listening on port: ${port}`);
}
void bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoriesModule } from '@infra/db/repositories/repositories.module';
import { TaskHttpModule } from '@infra/http/controllers/task.http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `./env/${process.env.ENV || 'local'}.env`,
        './env/base.env',
      ],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    RepositoriesModule,
    TaskHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

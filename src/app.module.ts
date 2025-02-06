import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './configs/app.config';
import botConfig from './configs/bot.config';
import jwtConfig from './configs/jwt.config';
import mongoConfig from './configs/mongo.config';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { MongooseConfigService } from './mongose/mongose.service';
import { RedisModule } from './modules/redis/redis.module';
import { AESModule } from './modules/aes/aes.module';
import aesConfig from './configs/aes.config';
import redisConfig from './configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        mongoConfig,
        jwtConfig,
        botConfig,
        aesConfig,
        redisConfig,
      ],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    RedisModule,
    AESModule,
    TelegramBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

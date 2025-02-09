import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import aesConfig from './configs/aes.config';
import appConfig from './configs/app.config';
import jwtConfig from './configs/jwt.config';
import mongoConfig from './configs/mongo.config';
import { AESModule } from './modules/aes/aes.module';
import redisConfig from './modules/redis/redis.config';
import { RedisModule } from './modules/redis/redis.module';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { MongoModule } from './modules/mongo/mongo.module';
import { ScheduleModule } from './schedule/schedule.module';

const scheduleModules = [NestScheduleModule.forRoot(), ScheduleModule];
const apiModules = [AESModule, TelegramBotModule];

function loadModules() {
  switch (process.env.PROCESS) {
    // case 'API':
    //   return apiModules;
    // case 'CRONJOB':
    //   return scheduleModules;
    default:
      return [...apiModules, ...scheduleModules];
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig, jwtConfig, aesConfig, redisConfig],
    }),
    MongoModule,
    RedisModule,
    ...loadModules(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

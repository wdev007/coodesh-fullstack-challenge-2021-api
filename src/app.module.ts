import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import configDatabase from './shared/config/database';

const { mongoFactory } = configDatabase();

const envFilePath = ['.env'];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot({ envFilePath })],
      useFactory: mongoFactory,
      inject: [ConfigService],
      connectionName: 'mongo',
    }),
    ScheduleModule.forRoot(),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ makes config available app-wide
    }),
    MongooseModule.forRoot('mongodb+srv://admin:1234@cluster0.sdomjzr.mongodb.net/the_heist_lab_db'), // Replace with your Mongo URI
    AuthModule,
    UsersModule,
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}

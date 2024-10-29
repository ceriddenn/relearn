import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './controllers/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './services/users/users.service';
import { JwtStrategy } from './strats/jwt.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

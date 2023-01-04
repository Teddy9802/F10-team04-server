import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { Image } from "../Image/entities/image.entity";

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, //
      Image,
    ]),
  ],
  providers: [
    AuthResolver, //
    AuthService,
    UsersService,
  ],
})
export class AuthModule {}

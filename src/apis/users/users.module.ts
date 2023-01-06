import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowCount } from "../followCounts/followCount.entity";
import { Image } from "../Image/entities/image.entity";
import { MailsService } from "../mails/mails.service";
import { User } from "./entities/user.entity";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Image,
      FollowCount,
    ]),
  ],

  providers: [UsersResolver, UsersService, MailsService],
})
export class UsersModule {}

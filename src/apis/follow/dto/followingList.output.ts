import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/apis/users/entities/user.entity";

@ObjectType()
export class FollowingList {
  @Field()
  id: string;

  @Field(() => User)
  user2: User;
}

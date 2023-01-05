import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/apis/users/entities/user.entity";
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class Follow {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  user1: User;

  @Field(() => User)
  @ManyToOne(() => User)
  user2: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

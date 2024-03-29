import { UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { IContext } from "src/commons/type/context";
import { ReviewComment } from "./entities/reviewComment.entity";
import { ReviewCommentsService } from "./reviewComments.service";

@Resolver()
export class ReviewCommentsResolver {
  constructor(
    private readonly reviewCommentsService: ReviewCommentsService //
  ) {}

  @Query(() => [ReviewComment])
  fetchReviewComments(
    @Args("reviewBoardId") reviewBoardId: string, //
    @Args("page", { nullable: true, type: () => Int }) page: number
  ) {
    return this.reviewCommentsService.findAll({ reviewBoardId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ReviewComment)
  createReviewComment(
    @Args("reviewBoardId") reviewBoardId: string, //
    @Args("reviewComment") reviewComment: string,
    @Context() context: IContext
  ) {
    const user = context.req.user.id;
    return this.reviewCommentsService.create({
      user,
      reviewBoardId,
      reviewComment,
    });
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewBoard } from "../reviewBoards/entities/reviewBoard.entity";
import { User } from "../users/entities/user.entity";
import { ReviewComment } from "./entities/reviewComment.entity";

@Injectable()
export class ReviewCommentsService {
  constructor(
    @InjectRepository(ReviewComment)
    private readonly reviewCommentRepository: Repository<ReviewComment>,

    @InjectRepository(ReviewBoard)
    private readonly reviewBoardRepository: Repository<ReviewBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll({ reviewBoardId, page }) {
    return await this.reviewCommentRepository.find({
      where: { reviewBoard: { id: reviewBoardId } },
      relations: ["reviewBoard", "user"],
      order: { createdAt: "ASC" },
      take: 9,
      skip: page ? (page - 1) * 9 : 0,
    });
  }

  async create({ user, reviewBoardId, reviewComment }) {
    const findId = await this.reviewBoardRepository.findOne({
      where: { id: reviewBoardId },
    });

    const findUser = await this.userRepository.findOne({
      where: { id: user },
    });

    return await this.reviewCommentRepository.save({
      reviewComment,
      reviewBoard: { id: findId.id },
      user: { id: findUser.id },
    });
  }
}

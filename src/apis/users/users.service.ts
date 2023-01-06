import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { Image } from "../Image/entities/image.entity";
import { FollowCount } from "../followCounts/followCount.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,

    @InjectRepository(FollowCount)
    private readonly followCountRepository: Repository<FollowCount>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findOne(type) {
    return await this.usersRepository.findOne({
      where: type,
    });
  }

  async findMe({ userId }) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async createUser({ createUserInput }) {
    const { email, password, cpassword, nickname, image, ...user } =
      createUserInput;

    const isValid = await this.cacheManager.get(createUserInput.email);
    const checkNickName = await this.usersRepository.findOne({
      where: { nickname },
    });
    const checkEmail = await this.usersRepository.findOne({ where: { email } });
    if (checkEmail) {
      throw new NotFoundException("이미 사용 중인 이메일 입니다.");
    } else if (checkNickName)
      throw new NotFoundException("이미 사용 중인 닉네임 입니다.");

    if (isValid !== true || !isValid)
      throw new BadRequestException("인증이 완료되지 않았습니다.");

    if (createUserInput.password !== createUserInput.cpassword) {
      throw new NotFoundException("비밀번호가 일치하지 않습니다.");
    }

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    let userImage = null;

    if (image) {
      userImage = await this.imagesRepository.save({
        imgUrl: image,
      });
    }

    const result = await this.usersRepository.save({
      ...createUserInput,
      image: userImage,
      password: hashedPassword,
    });

    const findUser = await this.usersRepository.findOne({
      where: { email },
    });

    this.followCountRepository.save({
      user: findUser,
    });

    return result;
  }

  async update({ userId, updateUserInput }) {
    const { image, ...user } = updateUserInput;

    const findUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["image"],
    });

    // if (userId !== findUser.id) {
    //   throw new ConflictException("수정 권한이 없습니다.");
    // }

    let userImage = {};

    if (image) {
      await this.imagesRepository.softDelete({ id: findUser.image.id });
      userImage = await this.imagesRepository.save({ imgUrl: image });
    }

    return await this.usersRepository.save({
      ...findUser,
      ...user,
      image: { ...userImage },
    });
  }

  async delete({ userId }) {
    const result = await this.usersRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }
}

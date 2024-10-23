import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/Post.Schema';
import { User } from 'src/users/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async create({ ...createPostDto }: CreatePostDto, userId: string) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const newPost = new this.PostModel(createPostDto);
    const savePost = await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: savePost._id,
      },
    });
    return savePost;
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

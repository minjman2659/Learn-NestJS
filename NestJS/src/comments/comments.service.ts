import { CatsRepository } from 'src/cats/repository/cats.repository';
import { CommentCreateDto } from './dto/comment.create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from 'src/schema/comments.schema';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly catsRepository: CatsRepository,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentModel.find();
      return comments;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async createComment(
    catId: string | Types.ObjectId,
    comment: CommentCreateDto,
    author: string | Types.ObjectId,
  ) {
    try {
      const targetCat = await this.catsRepository.findCatByIdWithoutPassword(
        catId,
      );

      if (!targetCat) {
        throw new NotFoundException('NOT_FOUND_CAT');
      }

      const { contents } = comment;

      const existedCat = await this.catsRepository.findCatByIdWithoutPassword(
        author,
      );

      if (!existedCat) {
        throw new NotFoundException('NOT_FOUND_CAT');
      }

      const newComment = await this.commentModel.create({
        author,
        contents,
        info: targetCat.id,
      });

      return newComment;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async plusLikeCount(commentId: string | Types.ObjectId) {
    try {
      const comment = await this.commentModel.findById(commentId);

      if (!comment) {
        throw new NotFoundException('NOT_FOUND_COMMENT');
      }

      comment.likeCount++;
      return await comment.save();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

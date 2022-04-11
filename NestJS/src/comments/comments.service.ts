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
      const result = comments.map(comment => comment.readOnlyData);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async createComment(
    catId: string | Types.ObjectId,
    comment: CommentCreateDto,
    authorId: string | Types.ObjectId,
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
        authorId,
      );

      if (!existedCat) {
        throw new NotFoundException('NOT_FOUND_CAT');
      }

      const newComment = await this.commentModel.create({
        authorId,
        contents,
        catId,
      });

      return newComment.readOnlyData;
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
      const result = await comment.save();
      return result.readOnlyData;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

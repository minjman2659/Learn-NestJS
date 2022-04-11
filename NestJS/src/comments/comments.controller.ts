import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentCat } from 'src/common/decorators/cat.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { Cat } from 'src/schema/cats.schema';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dto/comment.create.dto';

@ApiTags('Comments')
@Controller('comments')
@UseInterceptors(SuccessInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '모든 고양이 프로필에 적인 댓글 조회하기',
  })
  @Get()
  async getAllComments() {
    return this.commentsService.getAllComments();
  }

  @ApiOperation({
    summary: '특정 고양이 프로필에 댓글 남기기',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/:catId')
  async createComment(
    @Param('catId') catId: string | Types.ObjectId,
    @Body() body: CommentCreateDto,
    @CurrentCat() cat: Cat,
  ) {
    return this.commentsService.createComment(catId, body, cat.id);
  }

  @ApiOperation({
    summary: '특정 댓글에 좋아요 누르기',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:commentId')
  async plusLikeCount(@Param('commentId') commentId: string | Types.ObjectId) {
    return this.commentsService.plusLikeCount(commentId);
  }
}

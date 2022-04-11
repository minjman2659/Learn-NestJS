import { PickType } from '@nestjs/swagger';
import { Comment } from 'src/schema/comments.schema';

export class CommentCreateDto extends PickType(Comment, [
  'contents',
] as const) {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comment extends Document {
  @ApiProperty({
    example: '6252bf828a7154f072b791d8',
    description: '작성자 아이디',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'cats',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    example: '댓글 내용',
    description: '댓글 내용',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    example: '1',
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
  })
  @IsPositive()
  @IsNotEmpty()
  likeCount: number;

  @ApiProperty({
    example: '6252c79fc27b4d708c503b52',
    description: '작성 대상의 아이디',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'cats',
  })
  @IsString()
  @IsNotEmpty()
  infoId: string;

  readonly readOnlyData: {
    id: string;
    authorId: string;
    contents: string;
    likeCount: number;
    infoId: string;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// 가상으로 존재하는 데이터로, DB에는 저장되지 않으며 클라에게 전달하는 데이터로 활용
CommentSchema.virtual('readOnlyData').get(function (this: Comment) {
  return {
    id: this.id,
    authorId: this.authorId,
    contents: this.contents,
    likeCount: this.likeCount,
    infoId: this.infoId,
  };
});

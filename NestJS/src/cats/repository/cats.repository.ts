import { CommentSchema } from 'src/schema/comments.schema';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat } from 'src/schema/cats.schema';
import { CatRequestDto } from 'src/cats/dto/cats.request.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async existsByEmail(email: string) {
    try {
      const result = await this.catModel.exists({ email });
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async create(cat: CatRequestDto) {
    try {
      const newCat = await this.catModel.create(cat);
      return newCat;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    try {
      const cat = await this.catModel.findOne({ email });
      return cat;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findCatByIdWithoutPassword(
    catId: string | Types.ObjectId,
  ): Promise<Cat | null> {
    try {
      const cat = await this.catModel.findById(catId).select('-password');
      return cat;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findByIdAndUpdateImgInLocal(
    catId: string | Types.ObjectId,
    fileName: string,
  ) {
    try {
      const cat = await this.catModel.findById(catId);
      cat.imgUrl = `http://localhost:8080/image/${fileName}`;
      const newCat = await cat.save();
      return newCat.readOnlyData;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findByIdAndUpdateImgInAws(
    catId: string | Types.ObjectId,
    key: string,
    bucketName: string,
  ) {
    try {
      const cat = await this.catModel.findById(catId);
      cat.imgUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
      const newCat = await cat.save();
      return newCat.readOnlyData;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAllCats() {
    try {
      const comments = mongoose.model('comments', CommentSchema);
      const cats = await this.catModel.find().populate('comments', comments);
      return cats;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

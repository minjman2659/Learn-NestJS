import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat } from 'src/schema/cats.schema';
import { CatRequestDto } from 'src/cats/dto/cats.request.dto';

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

  async findByIdAndUpdateImg(catId: string | Types.ObjectId, fileName: string) {
    try {
      const cat = await this.catModel.findById(catId);
      cat.imgUrl = `http://localhost:8080/media/${fileName}`;
      const newCat = await cat.save();
      return newCat.readOnlyData;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAllCats() {
    try {
      const cats = await this.catModel.find();
      return cats;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

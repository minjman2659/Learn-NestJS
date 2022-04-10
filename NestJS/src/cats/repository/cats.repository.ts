import { CatRequestDto } from './../dto/cats.request.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from 'src/schema/cats.schema';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async existsByEmail(email: string) {
    try {
      const result = await this.catModel.exists({ email });
      return result;
    } catch (err) {
      throw new HttpException('DB: existsByEmail Error', 500);
    }
  }

  async create(cat: CatRequestDto) {
    try {
      const newCat = await this.catModel.create(cat);
      return newCat;
    } catch (err) {
      throw new HttpException('DB: create Error', 500);
    }
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    try {
      const cat = await this.catModel.findOne({ email });
      return cat;
    } catch (err) {
      throw new HttpException('DB: findOne Error', 500);
    }
  }

  async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
    try {
      const cat = await this.catModel.findById(catId).select('-password');
      return cat;
    } catch (err) {
      throw new HttpException('DB: findById Error', 500);
    }
  }
}

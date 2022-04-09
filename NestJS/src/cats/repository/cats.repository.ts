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
}

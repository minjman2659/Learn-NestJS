import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Cat } from 'src/schema/cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import { CatsRepository } from './repository/cats.repository';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async register(body: CatRequestDto) {
    const { email, name, password } = body;

    const isExist = await this.catsRepository.existsByEmail(email);
    if (isExist) {
      // 409 코드를 응답하는 클래스
      throw new ConflictException('이미 존재하는 고양이 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }

  logout() {
    return { token: null };
  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );

    return newCat;
  }

  async getAllCats() {
    const cats = await this.catsRepository.findAllCats();
    const readOnlyCats = cats.map(cat => cat.readOnlyData);
    return readOnlyCats;
  }
}

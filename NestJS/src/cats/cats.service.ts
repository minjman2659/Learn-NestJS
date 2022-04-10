import { CatsRepository } from './repository/cats.repository';
import { Injectable, ConflictException } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import * as bcrypt from 'bcrypt';

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
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from 'src/cats/repository';
import { LoginRequestDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;

    const cat = await this.catsRepository.findCatByEmail(email);
    if (!cat) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );
    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: cat.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}

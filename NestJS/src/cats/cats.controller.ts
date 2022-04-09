import { ReadOnlyCatDto } from './dto/cat.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatsService } from './cats.service';
import { CatRequestDto } from './dto/cats.request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Express에서 route와 같은 역할
@ApiTags('Cats')
@Controller('cats')
@UseInterceptors(SuccessInterceptor)
// @UseFilters(new HttpExceptionFilter())
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiOperation({ summary: '고양이 상세 조회' })
  @Get('/:catId')
  getCurrentCat() {
    return 'current cat';
  }

  @ApiResponse({
    status: 409,
    description: '이미 존재하는 고양이 입니다',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @HttpCode(201)
  @Post('register')
  async register(@Body() body: CatRequestDto) {
    const registeredCat = await this.catsService.register(body);
    return registeredCat;
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn() {
    return 'login';
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut() {
    return 'logout';
  }

  @ApiOperation({ summary: '고양이 사진 업로드' })
  @Post('upload/cats')
  uploadCatImg() {
    return 'uploadImg';
  }
}

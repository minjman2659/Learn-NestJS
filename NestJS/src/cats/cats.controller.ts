import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth';
import { JwtAuthGuard } from 'src/auth/jwt';
import { LoginRequestDto } from 'src/auth/dto';
import { CatsService } from './cats.service';
import { ReadOnlyCatDto, CatRequestDto, CatLoginDto } from './dto';
import { SuccessInterceptor } from 'src/common/interceptors';
import { CurrentCat } from 'src/common/decorators';
import { multerOptions } from 'src/common/utils';
import { Cat } from 'src/schema';

// Express에서 route와 같은 역할
@ApiTags('Cats')
@Controller('cats')
@UseInterceptors(SuccessInterceptor)
// @UseFilters(new HttpExceptionFilter())
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'OK',
    type: [ReadOnlyCatDto],
  })
  @ApiOperation({ summary: '고양이 리스트 조회' })
  @HttpCode(200)
  @Get()
  getAllCats() {
    return this.catsService.getAllCats();
  }

  @ApiResponse({
    status: 401,
    description: '접근 오류',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '고양이 상세 조회' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/:catId')
  getCurrentCat(@Param('catId') catId: string, @CurrentCat() cat: Cat) {
    console.log(catId);
    return cat.readOnlyData;
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

  @ApiResponse({
    status: 401,
    description: '이메일을 확인해주세요 | 비밀번호를 확인해주세요',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: CatLoginDto,
  })
  @ApiOperation({ summary: '로그인' })
  @HttpCode(200)
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiOperation({ summary: '로그아웃' })
  @HttpCode(200)
  @Post('logout')
  logOut() {
    return this.catsService.logout();
  }

  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiOperation({ summary: '고양이 사진 업로드' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions()))
  @UseGuards(JwtAuthGuard)
  @Post('upload/cats')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentCat() cat: Cat,
  ) {
    console.log(files);
    return this.catsService.uploadImg(cat, files);
  }
}

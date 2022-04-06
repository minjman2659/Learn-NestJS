// import { HttpExceptionFilter } from './../http-exception.filter';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
  // UseFilters,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { PositiveIntPipe } from 'src/common/pipes/positiveInt.pipe';
import { CatsService } from './cats.service';

// Express에서 route와 같은 역할
@Controller('cats')
@UseInterceptors(SuccessInterceptor)
// @UseFilters(new HttpExceptionFilter())
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getAllCat() {
    throw new HttpException('api exception', 401);
    return 'all cats';
  }

  @Get(':id')
  getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) id: number) {
    console.log(id);
    return { cat: 'one cat' };
  }

  @Post()
  createCat() {
    return 'create cat';
  }

  @Put(':id')
  updateCat() {
    return 'put cat';
  }

  @Patch(':id')
  updatePartialCat() {
    return 'patch cat';
  }

  @Delete(':id')
  deleteCat() {
    return 'delete cat';
  }
}

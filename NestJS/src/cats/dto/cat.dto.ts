import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from 'src/schema/cats.schema';

export class ReadOnlyCatDto extends PickType(Cat, [
  'email',
  'name',
  'imgUrl',
] as const) {
  @ApiProperty({
    example: '6251a10a62db5431219e5eb0',
    description: 'id',
    required: true,
  })
  id: string;
}

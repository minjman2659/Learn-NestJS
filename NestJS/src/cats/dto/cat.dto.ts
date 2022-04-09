import { Cat } from 'src/schema/cats.schema';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class ReadOnlyCatDto extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '6251a10a62db5431219e5eb0',
    description: 'id',
    required: true,
  })
  id: string;
}

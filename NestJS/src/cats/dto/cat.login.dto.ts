import { ApiProperty } from '@nestjs/swagger';

export class CatLoginDto {
  @ApiProperty({
    example: 'Bearer Token',
    description: '토큰',
  })
  token: string;
}

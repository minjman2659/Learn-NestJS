import { ApiProperty } from '@nestjs/swagger';

export class CatLoginDto {
  @ApiProperty({
    example: 'Bearer Token',
    description: 'Token',
  })
  token: string;
}

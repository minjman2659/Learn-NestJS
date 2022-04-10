import { PickType } from '@nestjs/swagger';
import { Cat } from 'src/schema';

export class LoginRequestDto extends PickType(Cat, [
  'email',
  'password',
] as const) {}

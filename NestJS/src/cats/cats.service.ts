import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  hiFunction(): string {
    return 'Hello!';
  }
}

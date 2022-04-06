import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // pre-controller
    console.log('Before...');

    // post-request
    // 아래 data는 먼저 실행된 컨트롤러(Controller)에서 리턴한 값이 들어온다.
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
      })),
    );
  }
}

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // response가 완료 되었을 때 로그를 찍고자 하는 경우
    res.on('finish', () => {
      this.logger.log(`${req.ip} ${req.method}`, req.originalUrl);
      this.logger.log(res.statusCode);
    });
    next();
  }
}

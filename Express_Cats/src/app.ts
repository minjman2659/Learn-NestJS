import * as express from 'express';
import catsRouter from './cats/cats.route';

const port = 8080;

class Server {
  public app: express.Application;

  constructor() {
    const app: express.Application = express();
    this.app = app;
  }

  private setRouter() {
    this.app.use(catsRouter);
  }

  private setMiddleware() {
    //* logging middleware
    this.app.use((req, res, next) => {
      console.log(req.rawHeaders[1]);
      console.log('This is logging middleware');
      next();
    });

    //* json middleware
    this.app.use(express.json());

    this.setRouter();

    //* 404 middleware
    this.app.use((req, res, next) => {
      console.log('This is error middleware');
      res.status(404).send({ error: 'NOT_FOUND' });
    });
  }

  public listen() {
    this.setMiddleware();
    this.app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  }
}

function initServer() {
  const server = new Server();
  server.listen();
}

initServer();

import { Inject, Injectable, NestContainer } from '@nest/core';

import { RouterProxy } from './router-proxy.service';
import { BadRequestException } from '../errors';
import { HttpServer } from '../interfaces';
import { HTTP_SERVER } from '../tokens';

@Injectable()
export class RoutesResolver {
  @Inject(HTTP_SERVER)
  private readonly httpServer: HttpServer;

  constructor(
    private readonly container: NestContainer,
    private readonly routerProxy: RouterProxy,
  ) {}

  public resolve(basePath: string) {}

  public registerNotFoundHandler() {
    this.httpServer.setNotFoundHandler((req: any) => {
      const method = this.httpServer.getRequestMethod(req);
      const url = this.httpServer.getRequestUrl(req);
      throw new Error(`Cannot ${method} ${url}`);
    });
  }

  public registerExceptionHandler() {
    this.httpServer.setErrorHandler((err: any) => {
      throw this.mapExternalException(err);
    });
  }

  private mapExternalException(err: any) {
    switch (true) {
      case err instanceof SyntaxError:
        return new BadRequestException((<Error>err).message);
      default:
        return err;
    }
  }
}
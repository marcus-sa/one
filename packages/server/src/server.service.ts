import { Inject, Injectable, Injector, Type, Utils } from '@nest/core';

import { HttpServer, HttpServerOptions, ServerFeatureOptions } from './interfaces';
import { HTTP_SERVER, HTTP_SERVER_OPTIONS } from './tokens';

@Injectable()
export class ServerService {
  private readonly controllers = new Set<Type<any>>();

  @Inject(HTTP_SERVER)
  private readonly httpServer: HttpServer;

  @Inject(HTTP_SERVER_OPTIONS)
  private readonly options: HttpServerOptions;

  constructor(private readonly injector: Injector) {}

  public add(controllers: Type<any>[], options: ServerFeatureOptions) {
    controllers.forEach(ref => {
      const controller = this.injector.get(ref);
      this.controllers.add(ref);
    });
  }

  public async start() {
    try {
      await Utils.promisify(this.httpServer.listen)(
        this.options.port,
        this.options.hostname,
      );
    } catch (e) {

    }
  }
}
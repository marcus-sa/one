import { Inject, Injectable, Injector, Type, Utils } from '@nest/core';
import * as https from 'https';
import * as http from 'http';

import { HttpServer, HttpServerOptions, ServerFeatureOptions } from './interfaces';
import { HTTP_SERVER, HTTP_SERVER_OPTIONS } from './tokens';
import { Middleware } from './middleware';

@Injectable()
export class ServerService {
  private readonly controllers = new Set<Type<any>>();
  private httpServer: http.Server | https.Server;

  @Inject(HTTP_SERVER_OPTIONS)
  private readonly options: HttpServerOptions;

  @Inject(HTTP_SERVER)
  private readonly httpAdapter: HttpServer;

  constructor(
    private readonly middleware: Middleware,
    private readonly injector: Injector,
  ) {}

  public add(controllers: Type<any>[], options: ServerFeatureOptions) {
    controllers.forEach(ref => {
      const controller = this.injector.get(ref);
      this.controllers.add(ref);
    });
  }

  public async registerMiddleware() {
    await this.middleware.register();
  }

  public registerHttpServer() {
    this.httpServer = this.httpAdapter.create();
  }

  public async listen() {
    await Utils.promisify(this.httpAdapter.listen)(
      this.options.port,
      this.options.hostname,
    );
  }

  public async start() {
    try {
      this.registerHttpServer();
      await this.registerMiddleware();
      await this.listen();
    } catch (e) {

    }
  }
}
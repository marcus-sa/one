import { Injectable, NestContainer, NestModule } from '@nest/core';

import { MiddlewareContainer } from './middleware-container.service';
import { MiddlewareResolver } from './middleware-resolver.service';
import { RoutesMapper } from './routes-mapper.service';

@Injectable()
export class Middleware {

  constructor(
    private readonly middlewareContainer: MiddlewareContainer,
    private readonly resolver: MiddlewareResolver,
    private readonly routesMapper: RoutesMapper,
    private readonly container: NestContainer,
  ) {}

  public async register() {
    const modules = this.container.getModules();
    await this.resolveMiddleware(modules);
  }

  private async resolveMiddleware(modules: Map<string, NestModule>) {
    await Promise.all(
      [...modules.entries()].map(async ([token, module]) => {
        const instance = this.container.getModule(token);
      }),
    );
  }

  private loadConfiguration(
    instance: NestModule,
    token: string,
  ) {

  }

}
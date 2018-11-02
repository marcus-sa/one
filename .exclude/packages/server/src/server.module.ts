import { APP_INIT, DynamicModule, Module, MODULE_INIT, Type } from '@nest/core';

import { HTTP_SERVER, HTTP_SERVER_OPTIONS } from './tokens';
import { ServerService } from './server.service';
import {
  HttpServer,
  HttpServerOptions,
  ServerFeatureOptions,
} from './interfaces';

import { MiddlewareModule } from './middleware';
import { RouterModule } from './router';
import { HelpersModule } from './helpers';

@Module()
export class ServerModule {
  static forRoot(
    adapter: HttpServer,
    options: HttpServerOptions,
  ): DynamicModule {
    return {
      module: ServerModule,
      imports: [
        MiddlewareModule,
        HelpersModule,
        RouterModule,
      ],
      providers: [
        ServerService,
        {
          provide: HTTP_SERVER_OPTIONS,
          useValue: options,
        },
        {
          provide: HTTP_SERVER,
          useClass: adapter,
        },
        {
          provide: APP_INIT,
          useFactory: (server: ServerService) => server.start(),
          deps: [ServerService],
          multi: true,
        },
      ],
    };
  }

  static forFeature(
    metadata: ServerFeatureOptions,
  ): DynamicModule {
    return {
      module: ServerModule,
      imports: [ServerService],
      providers: [
        ...metadata.controllers,
        metadata.configure,
        {
          provide: MODULE_INIT,
          useFactory: (server: ServerService) => server.resolve(metadata),
          deps: [ServerService],
          multi: true,
        },
      ],
    };
  }
}

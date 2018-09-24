import { APP_INITIALIZER, DynamicModule, Module, MODULE_INITIALIZER, Type } from '@nest/core';

import { HttpServer, HttpServerOptions, ServerFeatureOptions } from './interfaces';
import { HTTP_SERVER, HTTP_SERVER_OPTIONS } from './tokens';
import { MiddlewareModule } from './middleware';
import { ServerService } from './server.service';
import { RouterModule } from './router';

@Module()
export class ServerModule {
  static forRoot(adapter: HttpServer, options: HttpServerOptions = {}): DynamicModule {
    return {
      module: ServerModule,
      imports: [
        MiddlewareModule,
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
          provide: APP_INITIALIZER,
          useFactory: (server: ServerService) => server.start(),
          deps: [ServerService],
          multi: true,
        },
      ],
    };
  }

  static forFeature(
    controllers: Type<any>[],
    options: ServerFeatureOptions = {},
  ): DynamicModule {
    return {
      module: ServerModule,
      imports: [ServerService],
      providers: [
        ...controllers,
        {
          provide: MODULE_INITIALIZER,
          useFactory: (server: ServerService) => server.add(controllers, options),
          deps: [ServerService],
          multi: true,
        },
      ],
    };
  }
}
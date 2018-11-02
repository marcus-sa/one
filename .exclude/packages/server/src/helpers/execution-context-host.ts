import { Type } from '@nest/core';

import { HttpArgumentsHost } from '../interfaces';

export class ExecutionContextHost {
  constructor(
    private readonly args: any[],
    private readonly constructorRef: Type<any> = null,
    private readonly handler: Function = null,
  ) {}

  getClass<T = any>(): Type<T> {
    return this.constructorRef;
  }

  getHandler(): Function {
    return this.handler;
  }

  getArgs<T extends Array<any> = any[]>(): T {
    return this.args as T;
  }

  getArgByIndex<T = any>(index: number): T {
    return this.args[index] as T;
  }

  /*switchToRpc(): RpcArgumentsHost {
    return Object.assign(this, {
      getData: () => this.getArgByIndex(0),
    });
  }*/

  switchToHttp(): HttpArgumentsHost {
    return Object.assign(this, {
      getRequest: () => this.getArgByIndex(0),
      getResponse: () => this.getArgByIndex(1),
    });
  }

  /*switchToWs(): WsArgumentsHost {
    return Object.assign(this, {
      getClient: () => this.getArgByIndex(0),
      getData: () => this.getArgByIndex(1),
    });
  }*/
}
import { Injectable, Type, Utils } from '@nest/core';
import { Observable } from 'rxjs';

import { ExecutionContextHost } from '../helpers';
import { CanActivate } from '../interfaces';

type AnyFunction = (...args: any[]) => any;

@Injectable()
export class GuardsConsumer {
  public async tryActivate(
    guards: CanActivate[],
    args: any[],
    controller: Type<any>,
    callback: AnyFunction,
  ) {
    if (!guards || Utils.isEmpty(guards)) return true;
    const context = this.createContext(args, controller, callback);

    for (const guard of guards) {
      const result = guard.canActivate(context);
      if (await this.pickResult(result)) {
        continue;
      }
      return false;
    }
    return true;
  }

  private createContext(
    args: any[],
    controller: Type<any>,
    callback: AnyFunction,
  ) {
    return new ExecutionContextHost(
      args,
      controller.constructor,
      callback,
    );
  }

  private async pickResult(
    result: boolean | Promise<boolean> | Observable<boolean>,
  ): Promise<Boolean> {
    return result instanceof Observable
      ? result.toPromise()
      : result;
  }
}

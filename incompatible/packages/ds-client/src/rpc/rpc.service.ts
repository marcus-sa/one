import { Inject, Injectable, Injector, Type, Utils } from '@one/core';
import { Observable } from 'rxjs';

import { RpcResponseError, RpcResponseReject } from './exceptions';
import { DsClient } from '../ds-client.interface';
import { DEEPSTREAM_CLIENT } from '../symbols';
import { RpcStorage } from './rpc.storage';
import { RPCResponse } from '../deepstream';

export type ProvideCallback = <T>(
  data: any,
  response: RPCResponse,
) => Observable<T> | Promise<T> | T;

@Injectable()
export class DsRpcService {
  @Inject(DEEPSTREAM_CLIENT)
  private readonly client: DsClient;

  constructor(private readonly injector: Injector) {}

  public emit<T = any>(event: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.rpc.make(event, data, async (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  public on(event: string, callback: ProvideCallback) {
    this.client.rpc.provide(event, async (data, response) => {
      response.autoAck = false;

      await this.rpcResponseZone(response, async () => {
        const result = callback(data, response);
        return await Utils.transformResult(result);
      });
    });
  }

  private async rpcResponseZone(
    response: RPCResponse,
    promise: () => Promise<any>,
  ) {
    try {
      const result = await promise();
      return result ? response.send(result) : response.ack();
    } catch (error) {
      if (error instanceof RpcResponseError) {
        return response.error(error.message);
      } else if (error instanceof RpcResponseReject) {
        return response.reject();
      }

      response.error(`Unhandled error: ${error.message}`);
    }
  }

  public async add(providers: Type<any>[]) {
    providers.forEach(provider => {
      const rpcProvider = this.injector.get(provider);

      RpcStorage.getEventProvidersByType(provider).forEach(
        ({ method, event }) => {
          this.on(event, (data, response) => {
            return rpcProvider[method](data, response);
          });
        },
      );
    });
  }
}

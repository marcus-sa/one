import { forwardRef, Inject, Injectable } from '@one/core';

import { DsClient } from './ds-client.interface';
import { DEEPSTREAM_CLIENT } from './symbols';

@Injectable()
export class DsClientService {
  @Inject(forwardRef(() => DEEPSTREAM_CLIENT))
  private readonly client: DsClient;

  public async login(authParams?) {
    return new Promise((resolve, reject) => {
      this.client.login(authParams, (success, data) => {
        if (success) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }
}

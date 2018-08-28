import { Inject, Injectable } from '@one/core';

import { DsClient } from './ds-client.interface';
import { DEEPSTREAM_CLIENT } from './symbols';

@Injectable()
export class DsClientService {
  @Inject(DEEPSTREAM_CLIENT)
  private readonly client: DsClient;

  private listenForConnectionState() {
    this.client.on('connectionStateChanged', connectionState => {
      // will be called with 'CLOSED' once the connection is successfully closed.
    });
  }

  public async login(authParams?) {
    return new Promise((resolve, reject) => {
      this.client.login(authParams, (success, data) => {
        if (success) {
          resolve(data);
        } else {
          reject(data);
        }

        this.listenForConnectionState();
      });
    });
  }
}

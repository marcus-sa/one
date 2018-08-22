import { Injectable } from '@one/core';

@Injectable()
export class ElectronService {
  public async start() {
    console.log('ElectronService started');
  }
}

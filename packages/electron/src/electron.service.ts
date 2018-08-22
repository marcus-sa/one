import { Injectable } from '@nuclei/core';

@Injectable()
export class ElectronService {
  public async start() {
    console.log('ElectronService started');
  }
}

import { Injectable } from '@one/core';

@Injectable()
export class LessNestService {
  public hello() {
    console.log(`Hello from ${this.constructor.name}`);
  }
}

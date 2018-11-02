import { Type } from './interfaces';

import { OneFactory } from './factory';

export async function bootstrap(module: Type<any>) {
  const factory = new OneFactory(module);
  await factory.start();
}

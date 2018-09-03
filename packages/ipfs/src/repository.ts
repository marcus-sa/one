import { Type } from '@one/core';
import { transformAndValidate } from 'class-transformer-validator';

export class Repository<C> {
  constructor(
    private readonly ipfs: any,
    private readonly collection: Type<C>,
  ) {}

  public async save(...collections: C[]) {
    const collection = await transformAndValidate(
      <any>this.collection,
      collections,
    );
    console.log(collection);
  }
}

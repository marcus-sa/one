import { Type } from '@one/core';

export const getRepositoryToken = (collection: Type<any>) =>
  Symbol.for(`Repository<${collection.name}>`);

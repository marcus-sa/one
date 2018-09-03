import {
  Inject,
  Injectable,
  Type,
  ModuleRef,
  MODULE_REF,
  Provider,
} from '@one/core';

import { getRepositoryToken } from '../get-repository-token';
import { Repository } from '../repository';

@Injectable()
export class CollectionRegistry {
  @Inject(MODULE_REF)
  private readonly module!: ModuleRef;

  /*@Inject(IPFS_CLIENT)
  private readonly ipfs: any;*/

  public static create(collections: Type<any>[]): Provider[] {
    return collections.map(collection => {
      const token = getRepositoryToken(collection);

      return {
        provide: token,
        useFactory: () => new Repository({}, collection),
      };
    });
  }
}

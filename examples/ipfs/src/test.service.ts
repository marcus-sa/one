import { Injectable, forwardRef } from '@one/core';
import { InjectRepository, Repository } from '@one/ipfs';

import { UserCollection } from './user.collection';

@Injectable()
export class TestService {
  @InjectRepository(UserCollection)
  private readonly userRepository: Repository<UserCollection>;

  public start() {
    console.log(this.userRepository);
  }
}

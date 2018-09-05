import { Injectable } from '@one/core';
import { InjectRepository, Repository } from '@one/ipfs';

import { UserCollection } from './user.collection';

@Injectable()
export class TestService {
  @InjectRepository(UserCollection)
  private readonly userRepository: Repository<UserCollection>;

  public async start() {
    const users = [{
      username: 'virtuex',
      password: 'hey there',
    }];

    await this.userRepository.save(...users);
  }
}

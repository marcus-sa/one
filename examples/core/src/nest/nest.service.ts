import { Injectable } from '@one/core';

import { AppService } from '../app.service';
import { MoreNestService } from './more-nest';

@Injectable()
export class NestService {
  constructor(private readonly moreNest: MoreNestService) {}

  public start() {
    console.log(this);
  }
}

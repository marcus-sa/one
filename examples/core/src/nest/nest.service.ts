import { Injectable } from '@one/core';

import { MoreNestService } from './more-nest';

@Injectable()
export class NestService {
  constructor(private readonly moreNest: MoreNestService) {}
}

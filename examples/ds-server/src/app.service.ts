import { Injectable, Inject } from '@one/core';
import { DEEPSTREAM_SERVER } from '@one/ds-server';

@Injectable()
export class AppService {
  @Inject(DEEPSTREAM_SERVER)
  private readonly dsServer: any;
}

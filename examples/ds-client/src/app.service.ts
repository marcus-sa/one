import { Injectable, Inject } from '@one/core';
import { DEEPSTREAM_CLIENT, DsClient } from '@one/ds-client';

@Injectable()
export class AppService {
  @Inject(DEEPSTREAM_CLIENT)
  private readonly dsClient: DsClient;
}

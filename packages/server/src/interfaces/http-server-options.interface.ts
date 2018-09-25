import { ServerFeatureOptions } from './server-feature-options.interface';

export interface HttpServerOptions extends ServerFeatureOptions {
  hostname?: string;
  port: number;
}
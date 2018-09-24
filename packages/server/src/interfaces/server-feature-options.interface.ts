import { MiddlewareConsumer } from './middleware';

export interface ServerFeatureOptions {
  prefix?: string;
  guards?: any[],
  interceptors?: any[],
  middleware?: any[],
  pipes?: any[],
  // @TODO: Recode this
  configure: (consumer: MiddlewareConsumer) => MiddlewareConsumer | void;
}
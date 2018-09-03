import { Type } from './type.interface';
import { Provider } from './provider.interface';

export type Token = Type<Provider> | symbol;

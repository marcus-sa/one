import { Container } from 'inversify';

import { InjectionToken } from './module/injection-token';
import { Type } from './interfaces';

export const APP_INIT = new InjectionToken<any>('Initialize<App>');
export const APP_DESTROY = new InjectionToken<any>('Destroy<App>');
export const MODULE_INIT = new InjectionToken<any>('Initialize<Module>');
export const ONE_MODULE = new InjectionToken<Type<any>>('Ref<Module>');

export class Injector extends Container {}

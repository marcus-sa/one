import { Container } from 'inversify';

import { InjectionToken } from './module/injection-token';
import { Type } from './interfaces';

export const APP_INITIALIZER = new InjectionToken<any>('Initialize<App>');
export const MODULE_INITIALIZER = new InjectionToken<any>('Initialize<Module>');
export const MODULE_REF = new InjectionToken<Type<any>>('Ref<Module>');

export class Injector extends Container {}
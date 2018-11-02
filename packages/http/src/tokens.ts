// @ts-ignore
import { InjectionToken } from '@one/core';
import { AxiosAdapter } from 'axios';

export const AXIOS_INSTANCE_TOKEN = new InjectionToken<AxiosAdapter>('AXIOS_INSTANCE_TOKEN');

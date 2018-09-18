import { Observable } from 'rxjs';

import { InjectionToken, Module } from './module';
import { Type } from './interfaces';

export class Utils {
  public static async getDeferred<T>(value: any): Promise<T> {
    return this.isPromise(value) ? await value : value;
  }

  public static isIterable(val: any): val is Iterable<any> {
    return val && this.isFunction(val[Symbol.iterator]);
  }

  public static isPromise(val: any): val is Promise<any> {
    return val && this.isFunction(val.then);
  }

  public static isObservable(val: any): val is Observable<any> {
    return val && this.isFunction(val.subscribe);
  }

  public static isSymbol(val: any): val is symbol {
    return typeof val === 'symbol';
  }

  public static isNamedFunction(val: any): val is Type<any> | InjectionToken<any> {
    return val && !this.isNil(val.name) &&
      (this.isFunction(val) || this.isFunction(val.constructor));
  }

  public static isFunction(val: any): val is Function {
    return typeof val === 'function';
  }

  public static isNumber(val: any): val is number {
    return typeof val === 'number';
  }

  public static isBoolean(val: any): val is boolean {
    return typeof val === 'boolean';
  }

  public static isString(val: any): val is string {
    return typeof val === 'string';
  }

  public static isNil(val: any): val is undefined | null {
    return this.isUndefined(val) || val === null;
  }

  public static isUndefined(val: any): val is undefined {
    return typeof val === 'undefined';
  }

  public static promisify<F extends Function>(fn: F) {
    return <T>(...args: any[]): Promise<T> => {
      if (!this.isFunction(fn))
        throw new Error(
          `Can't promisify a non function: ${JSON.stringify(fn)}`,
        );

      return new Promise((resolve, reject) => {
        fn(...args, (err: Error, ...rest: any[]) => {
          if (err) return reject(err);
          resolve(...rest);
        });
      });
    };
  }

  public static getValues<T, S = string>(
    entries: IterableIterator<[S, T]> | Array<[S, T]>,
  ): T[] {
    // const iterable = this.isIterable(entries);

    return (<Array<[S, T]>>[...entries]).map<T>(([_, value]) => value);
  }

  public static concat<T = Type<Module>>(...props: any[]): T[] {
    return [].concat(...props);
  }

  public static flatten<T>(arr: any[][]): T[] {
    return arr.reduce((previous, current) => [...previous, ...current], []);
  }

  public static omit<T extends { [name: string]: any }>(
    from: T,
    ...by: any[]
  ): T {
    for (const key of by) {
      delete from[key];
    }

    return from;
  }

  public static async series<T>(promises: Promise<T>[]) {
    for (const promise of promises) {
      await promise;
    }
  }

  public static filterWhen<T>(
    arr: any[],
    statement: any,
    filter: (value: T, index: number, array: T[]) => boolean,
  ) {
    return !!statement ? arr.filter(filter) : arr;
  }

  public static pick<T>(from: any[], by: any[]): T[] {
    return from.filter(f => by.includes(f));
  }

  public static async transformResult<T>(
    resultOrDeferred: T | Promise<T> | Observable<T>,
  ): Promise<T> {
    if (this.isObservable(resultOrDeferred)) {
      return await (<Observable<T>>resultOrDeferred).toPromise();
    }

    return await resultOrDeferred;
  }
}

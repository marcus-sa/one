import { Observable } from 'rxjs';
import { Type } from 'packages/core/src/interfaces';
import { Module } from 'packages/core/src/module';

export class Utils {
  public static async getDeferred<T>(value: any): Promise<T> {
    return this.isPromise(value) ? await value : value;
  }

  public static isIterable<T>(val: any): val is Iterable<T> {
    return val && this.isFunction(val[Symbol.iterator]);
  }

  public static isPromise<T>(val: any): val is Promise<T> {
    return val && this.isFunction(val.then);
  }

  public static isObservable<T>(val: any): val is Observable<T> {
    return val && this.isFunction(val.subscribe);
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

  public static isUndefined(val: any): val is undefined {
    return typeof val === 'undefined';
  }

  public static promisify<F extends Function>(fn: F) {
    return <T>(...args: any[]): Promise<T> => {
      if (!this.isFunction(fn))
        throw new Error(`Can't promisify a non function: ${fn}`);

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
    const iterable = this.isIterable(entries);

    return (<Array<[S, T]>>(iterable ? [...entries] : entries)).map<T>(
      ([_, value]) => value,
    );
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

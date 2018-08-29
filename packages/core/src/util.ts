import { Observable } from 'rxjs';

export class Utils {
  public static isPromise(val: any): val is Promise<any> {
    return val && val.hasOwnProperty('then') && this.isFunction(val.then);
  }

  public static isObservable(val: any): val is Observable<any> {
    return (
      val && val.hasOwnProperty('subscribe') && this.isFunction(val.subscribe)
    );
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

  public static promisify<F>(fn: F) {
    return <T>(...args: any[]): Promise<T> => {
      if (!this.isFunction(fn))
        throw new Error(`Can't promisify a non function: ${fn}`);

      return new Promise((resolve, reject) => {
        fn(...args, (err, ...rest) => {
          if (err) return reject(err);
          resolve(...rest);
        });
      });
    };
  }

  public static flatten<T>(arr: any[][]): T[] {
    return arr.reduce((previous, current) => [...previous, ...current]);
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

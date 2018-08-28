import { Observable } from 'rxjs';

export class Utils {
  public static isFunction(fn: any) {
    return typeof fn === 'function';
  }

  public static flatten<T>(arr: any[][]): T[] {
    return arr.reduce((previous, current) => [...previous, ...current]);
  }

  public static pick<T = any>(from: any[], by: any[]): T[] {
    return from.filter(f => by.includes(f));
  }

  public static async transformResult<T = any>(
    resultOrDeferred: Promise<T> | Observable<T>,
  ) {
    if (
      resultOrDeferred &&
      this.isFunction((<Observable<T>>resultOrDeferred).subscribe)
    ) {
      return await (<Observable<T>>resultOrDeferred).toPromise();
    }

    return await resultOrDeferred;
  }
}

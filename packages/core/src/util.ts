export class Utils {

  public static flatten<T>(arr: any[][]): T[] {
    return arr.reduce((previous, current) => [...previous, ...current]);
  }

  public static pick<T = any>(from: any[], by: any[]): T[] {
    return from.filter(f => by.includes(f));
  }

}

import { ExceptionHandler } from './exception-handler';
import { UNHANDLED_RUNTIME_EXCEPTION } from './messages';

export class ExceptionsZone {
  private static readonly exceptionHandler = new ExceptionHandler();

  public static async run(zone: () => Promise<void>) {
    try {
      await zone();
    } catch (e) {
      this.exceptionHandler.handle(e);
      throw UNHANDLED_RUNTIME_EXCEPTION;
    }
  }
}

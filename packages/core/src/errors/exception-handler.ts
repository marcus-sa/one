import { RuntimeException } from './exceptions';

export class ExceptionHandler {
  public handle(exception: RuntimeException | Error) {
    console.error(exception.message, exception.stack);
  }

  /*private static readonly logger = new Logger(ExceptionHandler.name);



  public handle(exception: RuntimeException | Error) {
    if (!(exception instanceof RuntimeException)) {
      return ExceptionHandler.logger.error(exception.message, exception.stack);
    }
    ExceptionHandler.logger.error(exception.what(), exception.stack);
  }*/
}

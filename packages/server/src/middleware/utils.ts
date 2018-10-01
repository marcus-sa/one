import { Type, Utils } from '@nest/core';

export const filterMiddleware = (middleware: any[]) => {
  return []
    .concat(middleware)
    .filter(Utils.isFunction)
    .map(ware => mapToClass(ware));
};

export const mapToClass = (middleware: any) => {
  if (this.isClass(middleware)) return middleware;

  return assignToken(
    class {
      resolve = (...args: any[]) => (...params) => middleware(...params);
    },
  );
};

export const isClass = (middleware: any) => {
  return middleware.toString().substring(0, 5) === 'class';
};

export const assignToken = (metatype: Type<any>) => {
  this.id = this.id || 1;
  Object.defineProperty(metatype, 'name', {
    value: ++this.id,
  });
  return metatype;
};
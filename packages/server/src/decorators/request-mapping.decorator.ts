import { MetadataStorage } from '../metadata-storage';
import { RequestMethod } from '../enums'

export function RequestMapping(
  method: keyof RequestMethod = RequestMethod.GET,
  path: string = '/',
): MethodDecorator {
  return (target, propertyKey) => {
    MetadataStorage.requestMapping.add({
      propertyKey,
      method,
      target,
      path,
    });
  };
}

const createMappingDecorator = (method: keyof RequestMethod) => (path?: string) => RequestMapping(method, path);

export const Post = createMappingDecorator(RequestMethod.POST);
export const Get = createMappingDecorator(RequestMethod.GET);
export const Delete = createMappingDecorator(RequestMethod.DELETE);
export const Put = createMappingDecorator(RequestMethod.PUT);
export const Patch = createMappingDecorator(RequestMethod.PATCH);
export const Options = createMappingDecorator(RequestMethod.OPTIONS);
export const Head = createMappingDecorator(RequestMethod.HEAD);
export const All = createMappingDecorator(RequestMethod.ALL);
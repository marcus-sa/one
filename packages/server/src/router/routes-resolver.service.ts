import { Injectable, NestContainer } from '@nest/core';

@Injectable()
export class RoutesResolver {
  constructor(private readonly container: NestContainer) {}
}
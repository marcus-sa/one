import { Constructor } from '../interfaces';
import {
  postConstruct,
  injectable,
  targetName,
  unmanaged,
  decorate,
  optional,
  tagged,
  named,
} from 'inversify';

// Doesn't mark the font color as blue for functions
// in the import statements when using the below
// export const Injectable = injectable;

export function Injectable(): ClassDecorator {
  return injectable();
}

export function Optional() {
  return optional();
}

// Dunno what to do with this yet
export const PostConstruct = postConstruct;
export const TargetName = targetName;
export const Unmanaged = unmanaged;
export const Decorate = decorate;
export const Tagged = tagged;
export const Named = named;

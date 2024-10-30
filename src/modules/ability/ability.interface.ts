import { InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { User } from '../users/users.schema';
import { Session } from '../sessions/sessions.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

const subjects = [Session, User];

export type Subjects = InferSubjects<(typeof subjects)[number]> | 'all';

export type PossibleAbilities = [
  Action | Lowercase<keyof typeof Action>,
  Subjects,
];

export type AppAbility = MongoAbility<PossibleAbilities, MongoQuery>;

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

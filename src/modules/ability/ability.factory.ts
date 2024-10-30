import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoQuery,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, PossibleAbilities, Subjects } from './ability.interface';
import { Session } from '../sessions/sessions.schema';
// import { Session } from '../sessions/sessions.schema';

@Injectable()
export class AbilityFactory {
  createForUser(user: Express.User) {
    const { can, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, MongoQuery>,
    );

     if (user.type === 'ADMIN') {
      can(Action.Manage, 'all');
    } else {
      // Session
      can(Action.Delete, Session, {
        userId: user.id,
      });
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

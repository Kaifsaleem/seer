import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../modules/auth/auth.guard';
import {
  AbilityGuard,
  CheckPolicies,
} from '../../modules/ability/ability.guard';
import {
  Action,
  AppAbility,
  Subjects,
} from '../../modules/ability/ability.interface';

export default function CtmAuth(
  action: Action | Lowercase<keyof typeof Action> = Action.Read,
  subject?: Subjects,
) {
  return applyDecorators(
    UseGuards(AuthGuard, AbilityGuard),
    CheckPolicies((ability: AppAbility) =>
      subject ? ability.can(action, subject) : true,
    ),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Forbidden' },
          statusCode: { type: 'number', example: 403 },
        },
      },
    }),
    ApiBearerAuth(),
  );
}

import { applyDecorators, Post as NestPost } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export default function CtmPost() {
  return applyDecorators(
    NestPost(),
    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Bad Request' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );
}

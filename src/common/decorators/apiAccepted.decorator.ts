import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiAcceptedResponse as SwaggerApiAcceptedResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

export default function CtmApiAcceptedResponseC(option: ApiResponseOptions) {
  return applyDecorators(
    SwaggerApiAcceptedResponse(option),
    HttpCode(HttpStatus.ACCEPTED),
  );
}

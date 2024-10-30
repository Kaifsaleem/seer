import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from '../dto/paginated.dto';

export default function CtmApiGetResponse(
  options: Omit<ApiResponseSchemaHost, 'schema'> & { schema: string },
) {
  const { schema, ...rest } = options;

  const newSchema = {
    allOf: [
      {
        $ref: getSchemaPath(PaginatedDto),
      },
      {
        properties: {
          records: {
            type: 'array',
            items: { $ref: schema },
          },
        },
      },
    ],
  };

  const newOptions = {
    ...rest,
    schema: newSchema,
  };

  return applyDecorators(
    ApiExtraModels(PaginatedDto),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
    }),
    ApiOkResponse(newOptions),
  );
}

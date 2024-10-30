// import {
//   Catch,
//   ArgumentsHost,
//   ConflictException,
//   Logger,
//   ForbiddenException,
// } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';
// import { getErrorMessages } from '../../common/utils/helper';

// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   catch(e: any, host: ArgumentsHost) {
//     // Handle MongoDB unique constraint error
//     if (e?.name === 'MongoServerError') {
//       Logger.error(e.message, 'ConflictException');
//       if (e?.code === 11000) {
//         const errors = getErrorMessages(e);
//         e = new ConflictException(errors);
//       }
//     }

//     if (e?.applicationRef?.name === 'ForbiddenError') {
//       Logger.error(e?.applicationRef?.message, 'ForbiddenException');
//       e = new ForbiddenException(e?.applicationRef?.message);
//     }

//     super.catch(e, host);
//   }
// }

import {
  Catch,
  ArgumentsHost,
  Logger,
  // HttpException,
  BadRequestException,
  HttpException,
  // GoneException,
  // ConflictException,
  // Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
// import { getErrorMessages } from '../helpers';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    Logger.error(exception.message, exception.constructor.name);
    if (!(exception instanceof HttpException)) {
      console.log(exception.constructor);
    }

    switch (exception.constructor) {
      case QueryFailedError:
        throw new BadRequestException('Invalid data');
      // case EntityNotFoundError: // this is another TypeOrm error
      //   status = HttpStatus.UNPROCESSABLE_ENTITY;
      //   message = (exception as EntityNotFoundError).message;
      //   code = (exception as any).code;
      //   break;
      // case CannotCreateEntityIdMapError: // and another
      //   status = HttpStatus.UNPROCESSABLE_ENTITY;
      //   message = (exception as CannotCreateEntityIdMapError).message;
      //   code = (exception as any).code;
      //   break;
      default:
        super.catch(exception, host);
      // status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

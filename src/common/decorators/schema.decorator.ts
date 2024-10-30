// @Schema({
//   timestamps: true,
//   toObject: {
//     transform: function (doc, ret) {
//       Object.setPrototypeOf(ret, User.prototype);
//     },
//   },
// })

import { applyDecorators } from '@nestjs/common';
import { Schema, SchemaOptions } from '@nestjs/mongoose';

type Constructor<T = object> = new (...args: any[]) => T;

export default function CtmSchema(options?: SchemaOptions) {
  // Set default options if not provided
  options = options || {};
  options.timestamps = options.timestamps ?? true;

  return function <T extends Constructor>(target: T) {
    // Modify toObject to set the prototype of the returned object
    options.toObject = options.toObject ?? {
      transform: function (doc: any, ret: any) {
        // Set the prototype of 'ret' to the target's prototype
        Object.setPrototypeOf(ret, target.prototype);
        return ret; // Return the transformed object
      },
    };

    // Apply the decorators, using Schema with modified options
    return applyDecorators(Schema(options))(target);
  };
}

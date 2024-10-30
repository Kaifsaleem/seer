import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UtilsProvider {
  static async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async encryptPassword(password: string) {
    const saltRound = 10;
    const salt = await genSalt(saltRound);
    return await hash(password, salt);
  }
}

import { Transform } from 'class-transformer';
// import { randomBytes } from 'crypto';

export class Document {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  public _id: string;
}

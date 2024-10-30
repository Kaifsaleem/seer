export enum UserTypes {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type UserType = keyof typeof UserTypes | UserTypes;

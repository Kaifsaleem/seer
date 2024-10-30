import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity as TOBaseEntity,
  UpdateDateColumn,
} from 'typeorm';

class BaseEntity extends TOBaseEntity {
  @CreateDateColumn({
    name: 'created_at',
  })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  @Exclude()
  deletedAt: Date;
}

export default BaseEntity;

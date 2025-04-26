import { Module } from '@nestjs/common';
import { ConsultantController } from './consultant.controller';
import { ConsultantRagService } from './consultant.rag.service';
import { ConsultantVectorService } from './vector-db.service';
import { ConsultantService } from './consultant.service';
import { CsvService } from './csv.service';

@Module({
  controllers: [ConsultantController],
  providers: [
    ConsultantService,
    ConsultantRagService,
    ConsultantVectorService,
    CsvService,
  ],
})
export class ConsultantModule {}

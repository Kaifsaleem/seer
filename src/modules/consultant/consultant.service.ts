import { Injectable } from '@nestjs/common';
import { ConsultantRagService } from './consultant.rag.service';
import { ConsultantVectorService } from './vector-db.service';
import { CsvService } from './csv.service';
@Injectable()
export class ConsultantService {
  constructor(
    private readonly ragService: ConsultantRagService,
    private readonly vectorService: ConsultantVectorService,
    private readonly csvService: CsvService,
  ) {}
  async consult(question: string) {
    const questionEmbedding = await this.ragService.generateEmbedding(question);
    // const similarDocs = await this.vectorService.searchSimilar(
    //   questionEmbedding,
    //   3,
    // );

    // const context = similarDocs.map((d) => d.content).join('\n\n');
    // const answer = await this.ragService.generateAnswer(context, question);

    // return answer || 'No answer found';
  }

  async loadCsvAndEmbed(filePath: string) {
    const rows = await this.csvService.parseCsv(filePath);
    console.log('Parsed rows:', rows);

    for (const row of rows) {
      const text = this.csvService.formatRowToText(row);
      const embedding = await this.ragService.generateEmbedding(text);

      console.log('hello');
      await this.vectorService.addDocument(
        row.scheme_name,
        embedding,
        text,
        row,
      );
    }
  }
}

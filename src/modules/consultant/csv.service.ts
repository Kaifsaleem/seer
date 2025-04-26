import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  async parseCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        return reject(new BadRequestException(`File not found: ${filePath}`));
      }

      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          if (results.length === 0) {
            return reject(new BadRequestException('CSV file contains no data'));
          }
          resolve(results);
        })
        .on('error', (error) =>
          reject(
            new BadRequestException(`Error parsing CSV: ${error.message}`),
          ),
        );
    });
  }

  formatRowToText(row: any): string {
    try {
      return `Fund: ${row.scheme_name || 'N/A'}, 1Y Return: ${row.returns_1yr || 'N/A'}%, Risk: ${row.risk_level || 'N/A'}, Category: ${row.category || 'N/A'}, Expense Ratio: ${row.expense_ratio || 'N/A'}`;
    } catch (error) {
      console.error('Error formatting row:', error, row);
      return `Fund data: ${JSON.stringify(row)}`;
    }
  }
}

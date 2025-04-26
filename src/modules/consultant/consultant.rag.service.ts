import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ConsultantRagService {
  private genAI = new GoogleGenerativeAI(
    'AIzaSyCQqJG-cQ4uNUnVoecZcr8F7rdeTz2Hx4Y',
  );
  private model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateEmbedding(text: string): Promise<number[]> {
    const embedModel = this.genAI.getGenerativeModel({
      model: 'embedding-001',
    });

    try {
      const result = await embedModel.embedContent({
        content: { parts: [{ text }] },
      });
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateAnswer(context: string, question: string): Promise<string> {
    const result = await this.model.generateContent(
      `Given this data:\n\n${context}\n\nAnswer this:\n${question}`,
    );
    return result.response.text();
  }
}

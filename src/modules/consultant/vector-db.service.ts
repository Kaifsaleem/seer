import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultantVectorService {
  private baseUrl = 'http://localhost:8000'; // ChromaDB URL
  private endpoint =
    '/api/v2/tenants/seer-tenant/databases/new-db/collections/3fa85f64-5717-4562-b3fc-2c963f66afa6/add';

  async addDocument(
    id: string,
    embedding: number[],
    content: string,
    metadata: any,
  ) {
    console.log(
      `Adding document with id: ${id}, embedding length: ${embedding.length}`,
    );

    // Process individual embedding values
    for (let i = 0; i < embedding.length; i++) {
      const singleEmbedding = embedding[i];
      const documentId = `${id}_${i}`; // Create unique ID for each embedding value

      try {
        console.log({
          documents: [content],
          embeddings: [[singleEmbedding]], // Single embedding as a nested array
          ids: [documentId],
          metadatas: [
            {
              topic: metadata.topic || 'nestjs',
              dockerized: true,
              level: 'beginner',
            },
          ],
          uris: [metadata.uri || 'https://docs.nestjs.com/'],
        });
        await axios.post(`${this.baseUrl}${this.endpoint}`, {
          documents: [content],
          embeddings: [[singleEmbedding]], // Single embedding as a nested array
          ids: [documentId],
          metadatas: [
            {
              topic: metadata.topic || 'nestjs',
              dockerized: true,
              level: 'beginner',
            },
          ],
          uris: [metadata.uri || 'https://docs.nestjs.com/'],
        });

        if (i % 100 === 0) {
          console.log(
            `Processed ${i}/${embedding.length} embeddings for document ${id}`,
          );
        }
      } catch (error) {
        console.error(
          `Error adding embedding ${i} for document ${id}:`,
          error.message,
        );
        throw error;
      }
    }

    console.log(
      `Completed adding all ${embedding.length} embeddings for document ${id}`,
    );
  }

  async searchSimilar(embedding: number[], topK = 3) {
    const queryEndpoint = `${this.baseUrl}/api/v2/tenants/seer-tenant/databases/new-db/collections/3fa85f64-5717-4562-b3fc-2c963f66afa6/query`;
    try {
      const response = await axios.post(queryEndpoint, {
        embeddings: [embedding], // Send as nested array
        k: topK,
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching similar documents:', error.message);
      throw error;
    }
  }
}

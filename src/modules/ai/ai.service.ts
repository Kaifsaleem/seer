import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, type ChatSession } from '@google/generative-ai';
import { marked } from 'marked';

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;
  private readonly chatSessions: Map<string, ChatSession>;

  constructor() {
    // Hardcoded environment variable
    const GOOGLE_API_KEY = 'AIzaSyCQqJG-cQ4uNUnVoecZcr8F7rdeTz2Hx4Y'; // Replace with actual key in production

    this.genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
      },
    });
    this.chatSessions = new Map<string, ChatSession>();
  }

  private async formatResponseToMarkdown(
    text: string | Promise<string>,
  ): Promise<string> {
    const resolvedText = await Promise.resolve(text);
    let processedText = resolvedText.replace(/\r\n/g, '\n');

    processedText = processedText.replace(
      /^([A-Za-z][A-Za-z\s]+):(\s*)/gm,
      '## $1$2',
    );

    processedText = processedText.replace(
      /(?<=\n|^)([A-Za-z][A-Za-z\s]+):(?!\d)/gm,
      '### $1',
    );

    processedText = processedText.replace(/^[•●○]\s*/gm, '* ');

    const paragraphs = processedText.split('\n\n').filter(Boolean);

    const formatted = paragraphs
      .map((p) => {
        if (p.startsWith('#') || p.startsWith('*') || p.startsWith('-')) {
          return p;
        }
        return `${p}\n`;
      })
      .join('\n\n');

    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    return marked.parse(formatted);
  }

  async search(query: string) {
    try {
      const chat = this.model.startChat({
        tools: [{ google_search: {} }],
      });

      const result = await chat.sendMessage(query);
      const response = await result.response;
      const text = response.text();
      const formattedText = await this.formatResponseToMarkdown(text);

      const sourceMap = new Map<
        string,
        { title: string; url: string; snippet: string }
      >();
      const metadata = response.candidates?.[0]?.groundingMetadata as any;

      if (metadata) {
        const chunks = metadata.groundingChunks || [];
        const supports = metadata.groundingSupports || [];

        chunks.forEach((chunk: any, index: number) => {
          if (chunk.web?.uri && chunk.web?.title) {
            const url = chunk.web.uri;
            if (!sourceMap.has(url)) {
              const snippets = supports
                .filter((support: any) =>
                  support.groundingChunkIndices.includes(index),
                )
                .map((support: any) => support.segment.text)
                .join(' ');

              sourceMap.set(url, {
                title: chunk.web.title,
                url: url,
                snippet: snippets || '',
              });
            }
          }
        });
      }

      const sources = Array.from(sourceMap.values());
      const sessionId = Math.random().toString(36).substring(7);
      this.chatSessions.set(sessionId, chat);

      return {
        sessionId,
        summary: formattedText,
        sources,
      };
    } catch (error) {
      throw new Error(
        error.message || 'An error occurred while processing your search',
      );
    }
  }

  async followUp(sessionId: string, query: string) {
    try {
      const chat = this.chatSessions.get(sessionId);
      if (!chat) {
        throw new Error('Chat session not found');
      }

      const result = await chat.sendMessage(query);
      const response = await result.response;
      const text = response.text();
      const formattedText = await this.formatResponseToMarkdown(text);

      const sourceMap = new Map<
        string,
        { title: string; url: string; snippet: string }
      >();
      const metadata = response.candidates?.[0]?.groundingMetadata as any;

      if (metadata) {
        const chunks = metadata.groundingChunks || [];
        const supports = metadata.groundingSupports || [];

        chunks.forEach((chunk: any, index: number) => {
          if (chunk.web?.uri && chunk.web?.title) {
            const url = chunk.web.uri;
            if (!sourceMap.has(url)) {
              const snippets = supports
                .filter((support: any) =>
                  support.groundingChunkIndices.includes(index),
                )
                .map((support: any) => support.segment.text)
                .join(' ');

              sourceMap.set(url, {
                title: chunk.web.title,
                url: url,
                snippet: snippets || '',
              });
            }
          }
        });
      }

      const sources = Array.from(sourceMap.values());

      return {
        summary: formattedText,
        sources,
      };
    } catch (error) {
      throw new Error(
        error.message ||
          'An error occurred while processing your follow-up question',
      );
    }
  }
}

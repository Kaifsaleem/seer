import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';

class FollowUpDto {
  sessionId: string;
  query: string;
}

@Controller('api')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      throw new HttpException(
        'Query parameter "q" is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.aiService.search(query);
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while processing your search',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('follow-up')
  async followUp(@Body() body: FollowUpDto) {
    const { sessionId, query } = body;

    if (!sessionId || !query) {
      throw new HttpException(
        'Both sessionId and query are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.aiService.followUp(sessionId, query);
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An error occurred while processing your follow-up question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

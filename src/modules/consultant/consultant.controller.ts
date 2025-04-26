import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ConsultantService } from './consultant.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryFundDto } from './dto/consultant.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Consultant')
@Controller('consultant')
@UseGuards(ThrottlerGuard)
export class ConsultantController {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly uploadsDir = './uploads';

  constructor(private readonly consultantService: ConsultantService) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = path.join(this.uploadsDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    try {
      console.log('File saved to:', filePath);
      await this.consultantService.loadCsvAndEmbed(filePath);
      return { message: 'CSV processed and embedded' };
    } catch (error) {
      throw new BadRequestException(`Failed to process CSV: ${error.message}`);
    }
  }

  @Post('query')
  @ApiOperation({ summary: 'Query fund information' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Query processed successfully',
    type: QueryFundDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
  })
  async queryFund(@Body() body: QueryFundDto) {
    try {
      // return await this.consultantService.queryFund(body);
      return { message: 'Query feature will be implemented soon' };
    } catch (error) {
      throw new BadRequestException(
        'Failed to process query: ' + error.message,
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './sessions.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}
  create(
    createSessionDto: Omit<CreateSessionDto, 'valid' | 'createdAt' | '_id'>,
  ) {
    return this.sessionModel.create(createSessionDto);
  }

  async getValidSessions(userId: string, page: number, limit: number) {
    const results = await this.sessionModel.find(
      { userId, valid: true },
      ['_id', 'ip', 'userAgent', 'createdAt'],
      {
        sort: { createdAt: -1 },
        skip: (page - 1) * limit,
        limit,
      },
    );

    const totalCount = await this.sessionModel.countDocuments({
      userId,
      valid: true,
    });

    return {
      count: results.length,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      results: results.map((result) => result.toObject()),
    };
  }

  async validateSession(id: string) {
    return (
      await this.sessionModel.findOne({ _id: id, valid: true })
    ).toObject();
  }

  async invalidateSession(id: string) {
    const session = await this.sessionModel.updateOne(
      { _id: id },
      { valid: false },
    );

    return session.matchedCount > 0;
  }
}

import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/docs', 302)
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('hello')
  getHello2(): string {
    return 'Hello World!';
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['/', '/ping', '/healthcheck'])
  @ApiOperation({
    summary: 'Basic endpoint to verify that the API is up and running',
  })
  @ApiResponse({ status: 200, description: 'App is running' })
  @ApiResponse({ status: 500, description: 'App is not reachable' })
  getHello(): string {
    return this.appService.getHello();
  }
}

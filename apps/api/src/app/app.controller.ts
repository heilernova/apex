import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    throw new Error('Error de prueba desde el controlador');
    return this.appService.getData();
  }
}

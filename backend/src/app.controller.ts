import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controlador raíz de ejemplo.
 * Expone un endpoint simple de salud/bienvenida.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint GET / que devuelve un saludo.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

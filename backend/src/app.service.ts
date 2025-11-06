import { Injectable } from '@nestjs/common';

/**
 * Servicio de ejemplo para lógica trivial.
 * Aquí podría ir lógica reutilizable global.
 */
@Injectable()
export class AppService {
  /**
   * Devuelve un saludo estático. Útil para comprobar que el backend responde.
   */
  getHello(): string {
    return 'Hello World!';
  }
}

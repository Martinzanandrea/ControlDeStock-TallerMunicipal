import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Crea la aplicación Nest y habilita CORS para permitir al frontend comunicarse.
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Escucha en el puerto definido por env o 3000 por defecto.
  await app.listen(process.env.PORT ?? 3000);
}
// Ejecutamos el arranque y marcamos la promesa como intencionalmente ignorada.
void bootstrap();

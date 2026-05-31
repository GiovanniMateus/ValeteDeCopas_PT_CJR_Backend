import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000', // porta do Frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos permitidos
    
  });


  // a pasta uploads vai ficar aberta para que seus arquivos possam ser acessados
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

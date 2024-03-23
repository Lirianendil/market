import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { APPLICATION_LISTEN_PORT } from "./constants";
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  await app.listen(APPLICATION_LISTEN_PORT);
  console.info(`MARKET-API backend is listening on ${APPLICATION_LISTEN_PORT}`);
}

bootstrap();

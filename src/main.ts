import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { graphqlUploadExpress } from "graphql-upload";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./commons/filter/http-exception.fillter";
import { RedisAdapter } from "./commons/websocket/websocket.adapter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });
  const redisIoAdapter = new RedisAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(graphqlUploadExpress());

  await app.listen(3000);
}
bootstrap();

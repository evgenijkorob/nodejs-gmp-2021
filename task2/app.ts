import express, { Express, json } from 'express';
import { handleAllErrors } from './middleware';
import userApiRouter from './user';

const app: Express = express();
const port: number = 5000;

app
  .use(json())
  .use('/api/v1', userApiRouter)
  .use(handleAllErrors);

app.listen(port, () => console.log(`Running on http://localhost:${port}/`));

import express from 'express';
import mongoose from 'mongoose'
import { json } from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import {options} from '../swaggerOptions';
import loginRouter from './routes/login';

dotenv.config();

const app = express()
app.use(json())

const apiSpecs = swaggerJSDoc(options);

app.use('/docs', swaggerUI.serve);
app.get('/docs', swaggerUI.setup(apiSpecs, { explorer: true }));

app.use('/api/v1/login', loginRouter);

if (!process.env.MONGOURI) {
  throw new Error('MONGOURI is not defined');
}
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`)
})

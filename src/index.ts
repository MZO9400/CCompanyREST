import express from 'express';
import mongoose from 'mongoose'
import { json } from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import loginRouter from './routes/login';
import registerRouter from './routes/register';
import {options} from '../swaggerOptions';
import getCompanies from "./routes/getCompanies";

dotenv.config();

const app = express()
app.use(json())

const apiSpecs = swaggerJSDoc(options);

app.use('/docs', swaggerUI.serve);
app.get('/docs', swaggerUI.setup(apiSpecs, { explorer: true }));

app.use('/api/v1/login', loginRouter);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/getCompanies', getCompanies)

if (!process.env.MONGOURI) {
  throw new Error('MONGOURI is not defined');
}
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log("Connected to MongoDB"))

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`)
})

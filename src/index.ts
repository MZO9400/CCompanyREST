import express from 'express';
import mongoose from 'mongoose'
import { json } from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express()
app.use(json())

const apiSpecs = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "C Company API Docs",
      description: "API server for C Company",
      contact: {
        name: "Hamza",
        url: "https://github.com/MZO9400",
        email: "hamza.hameed00@gmail.com"
      },
    },
    servers: [
      {
        url: "http://localhost:3000/"
      }
    ],
  },
  apis: [
      ".//src/**/*.ts"
  ]
});

app.use('/docs', swaggerUI.serve);
app.get('/docs', swaggerUI.setup(apiSpecs, { explorer: true }));

if (!process.env.MONGOURI) {
  throw new Error('MONGOURI is not defined');
}
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(e => console.log(e))

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`)
})

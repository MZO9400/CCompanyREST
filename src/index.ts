import express from 'express';
import mongoose from 'mongoose'
import { json } from 'body-parser';
import { todoRouter } from './routes/todo'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express()
app.use(json())
app.use(todoRouter)

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title:'C Company server API',
      version:'1.0.0'
    }
  },
  apis:['index.ts'],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));


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

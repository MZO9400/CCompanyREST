import http from 'http';
import express from 'express';
import mongoose from 'mongoose'
import enforce from 'express-sslify';
import {json} from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import loginRouter from './routes/login';
import registerRouter from './routes/register';
import {options} from '../swaggerOptions';
import getCompanies from "./routes/getCompanies";

dotenv.config();

const app = express()
app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(json())

const apiSpecs = swaggerJSDoc(options);

app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(apiSpecs, {explorer: true}));

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

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`)
})

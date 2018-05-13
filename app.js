import config from "./config/index";
import express from "express"
import {authorRouter} from './routes/index'

const {apiPort} = config

const app = express();

app.use(express.json());

app.use('/author', authorRouter);

app.listen(apiPort, () => console.log(`API listening on port ${apiPort}`));


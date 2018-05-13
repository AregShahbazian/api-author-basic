import config from "./config/index";
import express from "express"
import {authorRouter} from './routes/index'

const {apiPort} = config

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers',
        'Accept, Content-Type, Content-Encoding, Server, Transfer-Encoding, X-Requested-With, X-Authorization')
    next();
});

app.use('/author', authorRouter);

app.listen(apiPort, () => console.log(`API listening on port ${apiPort}`));


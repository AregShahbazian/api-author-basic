require('dotenv').config()
import express  from "express"
import {authorRouter} from './routes/index'

const app = express();

app.use(express.json());
app.use('/author', authorRouter);

const PORT = process.env.API_PORT;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));


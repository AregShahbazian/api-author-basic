import express  from "express"
import {authorRouter} from './routes/index'

const app = express();
const PORT = 8081;

app.use(express.json());
app.use('/author', authorRouter);


app.listen(PORT, () => console.log(`API listening on port ${PORT}`));


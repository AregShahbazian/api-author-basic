const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3000, () => console.log('Example app listening on port 3000!'));


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./routers/router');
const errorMiddleware = require('./middlewares/error-middleware');

const port = process.env.SERVER_PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

function init() {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_URL);
    app.listen(port, () => console.log(`server is listening on port ${port}`));
  } catch(error) {
    console.log(error);
  }
}

init();

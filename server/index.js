require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers/router');

const port = process.env.SERVER_PORT || 5000;

const app = express();
app.use(express.json());
app.use('/api', router);

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

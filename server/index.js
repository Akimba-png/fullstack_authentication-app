require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.SERVER_PORT || 5000;

const app = express();

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

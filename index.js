const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('config');
const PORT = config.get('serverPort');

const app = express();

const start = async () => {
  try {
    await mongoose.connect(config.get('dbURL'), {});
    app.listen(PORT, () => {
      console.log('server started on port', PORT);
    });
  } catch (e) {
    console.error(e);
  }
};

start();

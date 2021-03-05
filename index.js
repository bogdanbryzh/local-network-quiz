#!/usr/bin/env node
const path = require('path');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// DB settings
// const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';

// Connecting to DB
mongoose.connect(
  mongoURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('connected to DB');
  }
);

// Express settings
const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors('*'));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./public/build'));

// Importing routes
const questionRoute = require('./routes/question');
const scoreRoute = require('./routes/score');
const questionsRoute = require('./routes/questions');
const resultsRoute = require('./routes/results');

app.use('/question', questionRoute);
app.use('/score', scoreRoute);
app.use('/questions', questionsRoute);
app.use('/results', resultsRoute);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

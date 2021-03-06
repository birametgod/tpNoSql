const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const velovRoutes = require('./routes/velov');
const touristiqueRoutes = require('./routes/touristique');
const config = require('config');
const db = config.get('db');
const Velov = require('./models/velov');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const formatScript = require('./script/formatScript');

formatScript.formatVelov();
formatScript.formatQuartiers();
formatScript.formatPoinTouristiques();
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connected failed');
  });

setInterval(() => {
  formatScript.formatVelov();
  formatScript.formatQuartiers();
  formatScript.formatPoinTouristiques();
  mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  });
}, 60 * 60000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS,PUT');
  next();
});
// 201 like 200 evrything is ok but new resource is created
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/station', velovRoutes);
app.use('/api/touris', touristiqueRoutes);

module.exports = app;

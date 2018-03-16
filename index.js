const express = require('express');
const ElasClient = require('elasticsearch').elasticsearchClient;
const bodyParser = require('body-parser');

const app = express();

const port = 9292;

app.use(bodyParser.urlencoded({ extended: true }));

require('./api/routes')(app, {});

app.listen(port, () => {
  console.log('We are live on ' + port);
});

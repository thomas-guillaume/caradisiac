const elasticsearch = require('elasticsearch');
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');


var elasticClient = new elasticsearch.Client({
    host: '192.168.99.100:9200',
    log: 'trace'
});


async function populate() {
  const brands = await getBrands();
  var body = [];
  var compteur = 1;
  for(var i=0; i<brands.length; i++)
  {
    const models = await getModels(brands[i]);
    for(var j=0; j<models.length; j++)
    {
      body.push({
        index:
        {
          _index: 'caradisiac',
          _type: 'car',
          _id: compteur
        }
      });
      body.push(models[j]);
      compteur++;
    }
  }
  elasticClient.bulk({
      body: body
  }, function (error, response) {
      if (error) {
          console.error(error);
          return;
      }
      else {
          console.log(response);
      }
  });
}


module.exports = function(app, db) {
  app.post('/populate', (req, res) => {
    populate()
    res.send('Indexing Records to ElasticSearch')
  });
  app.post('/suv', (req, res) => {
    // You'll create your note here.
    res.send('List of SUV')
  });
};

const elasticsearch = require('elasticsearch');
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');


/*
 * Define ElasticSearch Client.
 */
var elasticClient = new elasticsearch.Client({
    /*
     * you can replace the following ip address by localhost:9200 if elasticsearch is installed on your laptop
     */
    host: '192.168.99.100:9200',
    log: 'trace'
});


/*
 * Asynchronous function to get the brands, and the models thanks to the brands.
 */
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
  /*
   * Send all the models to ES with bulk.
   */
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

/*
 * Asynchronous function to get the list of SUV according to their volume and sorting in descending order.
 * In order to have the more appropriate query, I decided to query only vehicules with a volume greater than 500 or equal.
 */
async function suv() {
  elasticClient.search({
    index: 'caradisiac',
    type: 'car',
    body:{
      "size": 125,
      "query": {
        "range": {
          "volume": {
            "gte" : "500"
          }
        }
      },
      "sort":[
        {"volume.keyword" :{"order":"desc"}}
      ]
    }
  }, function (error, response) {
       if (error){
         console.error(error)
         return;
       }
       else {
         console.log(response);
       }
  });
}


/*
 * Creation of the endpoints /populate and /suv.
 */
module.exports = function(app, db) {
  app.post('/populate', (req, res) => {
    populate()
    res.send('Indexing Records to ElasticSearch')
  });
  app.post('/suv', (req, res) => {
    suv()
    res.send('List of SUV')
  });
};

const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

async function populate() {
  const brands = await getBrands();
  console.log(brands);
  for(var i=0; i<brands.length; i++)
  {
    const models = await getModels(brands[i]);
    console.log(models);
  }
}

module.exports = function(app, db) {
  app.post('/populate', (req, res) => {
    populate()
    res.send('Index Records to ElasticSearch')
  });
  app.post('/suv', (req, res) => {
    // You'll create your note here.
    res.send('List of SUV')
  });
};

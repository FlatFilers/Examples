const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express()

app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(9000, () => console.info('App listening on port 9000!'))


/**
 * Set these to your config settings
 */
FF_LICENSE = 'flatfile_license_key'
url = 'mongodb://localhost:28015' // Connection URL
dbName = 'myproject' // Database Name

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});

app.get('/', function (req, res) {
  // create config from schema
  res.render('index.ejs', {config: {}, license: FF_LICENSE})
})

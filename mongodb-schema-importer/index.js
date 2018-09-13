const express = require('express')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const config = require('./.env.js')

const app = express()

app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(9000, () => console.info('App listening on port 9000!'))

app.get('/', function (req, res) {
  if (config.url && config.dbName && config.collection) {
    MongoClient.connect(config.url).then(async function(err, client) {
      assert.equal(null, err)
      console.log("Connected successfully to server")
      
      const db = client.db(config.dbName)
      const response = await findRobotTraits(db)
      console.log(`Found the following ${config.collection} traits:`, response)
      client.close()
      
      const FF_config = {
        fields: response.map(v => { return {key: v} }),
        type: config.collection
      }
      
      res.render('index.ejs', {config: FF_config, license: config.FF_LICENSE})
    }).catch((err) => {
      console.warn('The database connection failed: ', err)
      renderDefault(res)
    })
  } else {
    console.log('Insufficient database information was provided')
    renderDefault(res)
  }
})

app.get('/populate-defaults', function (req, res) {
  MongoClient.connect(config.url).then(async function(err, client) {
    assert.equal(null, err)
    console.log("Connected successfully to server")
  
    const db = client.db(config.dbName)
    const response = await insertRobots(db)
    client.close()
    
    res.status(200).send(`Inserted ${response.insertedCount} Robots`)
  }).catch((err) => {
    console.warn('The database connection failed: ', err)
    res.status(500).send('The database connection failed: ', err)
  })
})

const renderDefault = function (res) {
  res.render('index.ejs', {
    config: {
      fields: [
        {key: 'default_field1'},
        {key: 'default_field2'},
        {key: 'default_field3'},
        {key: 'default_field4'},
      ],
      type: 'Generic Data'
    },
    license: config.FF_LICENSE
  })
}

const insertRobots = function(db) {
  const collection = db.collection(config.collection)
  return new Promise((resolve, reject) => {
    collection.insertMany([
      {name: '9 Sixty', nick: 'Silence', helmet: 'triangular'},
      {name: '19 War Prime', color: 'gray', nick: 'Shard', helmet: 'hexagram'},
      {name: '23 Sunny Day', color: 'gold', nick: 'Happy', helmet: 'square'},
      {name: 'R32 Jingle Bells', color: 'red', nick: 'Killer', helmet: 'octagonal', id: 'AN30'}
    ], function(err, result) {
      assert.equal(err, null)
      assert.equal(4, result.result.n)
      assert.equal(4, result.ops.length)
      console.log("Inserted 4 rows into the collection")
      resolve(result)
    })
  })
}

const findRobotTraits = async function(db) {
  const collection = db.collection(config.collection)
  return new Promise((resolve, reject) => {
    collection.find({}).project({_id: 0}).toArray(async function(err, robots) {
      assert.equal(err, null)
      resolve(robots.reduce((acc, robot) => [...acc, ...Object.keys(robot).filter(t => acc.indexOf(t) < 0)], []))
    })
  })
}

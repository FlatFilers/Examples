const express = require('express')

const app = express()

app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(9000, () => console.info('App listening on port 9000!'))


/**
 * Set these to your config settings
 */
const config = {
  FF_LICENSE: 'flatfile_license'
}

app.get('/', function (req, res) {
  // create config from schema
  res.render('index.ejs', {config: {}, license: config.FF_LICENSE})
})

const express = require('express')
const aws = require('aws-sdk')

const app = express()

app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(9000, () => console.info('App listening on port 9000!'))


/**
 * Set these to your config settings
 */
const config = {
  AWS_SECRET_ACCESS_KEY: 'secret_access_key',
  AWS_ACCESS_KEY_ID: 'key_id',
  AWS_BUCKET_REGION: 'bucket_region',
  AWS_BUCKET_NAME: 'bucket_name',
  FF_LICENSE: 'flatfile_license'
}

app.get('/', function (req, res) {
  const s3 = new aws.S3()
  const fileType = 'text/csv'
  const fileName = uuid() + '.csv'
  console.log
  const s3Params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }
  aws.config.update({
    "region": config.AWS_BUCKET_REGION,
    "accessKeyId": config.AWS_ACCESS_KEY_ID,
    "secretAccessKey": config.AWS_SECRET_ACCESS_KEY,
    "region": config.AWS_BUCKET_REGION
  })
  s3.getSignedUrl('putObject', s3Params, function (err, data) {
    if (err) {
      console.log(err)
      return res.end()
    }
    const returnData = {
      signedRequest: data,
      url: `https://${config.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      license: config.FF_LICENSE
    }
    res.render('index.ejs', returnData)
  })
})

/**
 * https://gist.github.com/LeverOne/1308368
 */
function uuid (a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}
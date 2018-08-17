const express = require('express')
const aws = require('aws-sdk')

const app = express()

app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(9000, () => console.info('App listening on port 9000!'))
app.locals.launch = function (x) { alert(x) }
app.locals.config = { ...process.env }

const config = {
  AWS_SECRET_ACCESS_KEY: 'access_key',
  AWS_ACCESS_KEY_ID: 'key_id',
  AWS_BUCKET_REGION: 'region',
  AWS_BUCKET_NAME: 'bucket'
}

/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */

aws.config.region = config.AWS_BUCKET_REGION

app.get('/', function (req, res) {
  const s3 = new aws.S3();
  const fileType = 'text/csv'
  const fileName = 'ff-demo-filename.csv' // UUID generate
  const s3Params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }
  aws.config.update({
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
      url: `https://${config.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}` // UUID generate
    }
    res.render('index.ejs', returnData)
  })
})
const express = require('express')
const aws = require('aws-sdk')
// const Papa = require('papaparse')

const app = express()

app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(9000, () => console.info('App listening on port 9000!'))
app.locals.launch = function (x) { alert(x) }
app.locals.config = { ...process.env }

/*
 * Respond to GET requests to /
*/

const config = {
  AWS_BUCKET_REGION: 'us-west-2',
  AWS_BUCKET_NAME: 'ff-demos'
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

  s3.getSignedUrl('putObject', s3Params, function (err, data) {
    if(err){
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

const uploadToS3 = async function (fileName, validData) {
  const s3 = new aws.S3()
  const fileType = 'text/csv'
  const bucket = config.AWS_BUCKET_NAME
  const s3Params = {
    Bucket: bucket,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }
  let signedUrl = {}
  aws.config.update({ "accessKeyId": "jQZ75HB/pkFtLXQVn7I75oyjgz19CeMyp3uDpsHQ", "secretAccessKey": "AKIAIMLTH7B5UKPCAARA", "region": "us-west-2" })
  try {
    signedUrl = await s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.error(`Couldn't get signed url: ${err}`)
      }
      if (data) {
        return {
          signedRequest: data,
          url: `https://${bucket}.s3.amazonaws.com/${fileName}`
        }
      } else {
        throw new Error('No signed url')
      }
    })
  } catch (err) {
    robotImporter.displayError(`There was an error with Amazon S3: ${err}`)
    return
  }
  // axios.post(signedUrl.signedRequest, Papa.unparse(validData))
  //   .then(() => {
  //     robotImporter.displaySuccess('Success!')
  //   })
  //   .catch((err) => {
  //     robotImporter.displayError(`Error: ${err}`)
  //   })
  return signedUrl.url
}
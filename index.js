import express from 'express'
import aws from 'aws-sdk'
import FlatfileImporter from 'flatfile-csv-importer'
import axios from 'axios'
import Papa from 'papaparse'

const app = express()
app.set('views', './views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
app.listen(process.env.PORT || 9000, () => console.log('App listening on port 9000!'))

/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */

aws.config.region = process.env.AWS_BUCKET_REGION || 'us-west-2'

/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.AWS_BUCKET_REGION || 'ff-demos'

/*
 * Respond to GET requests to /
 */
app.get('/', (req, res) => res.render('index.html'))


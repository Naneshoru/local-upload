import dotenv from 'dotenv'
dotenv.config()
import config from './config.js'
import { Client } from 'minio'

const minioClient = new Client({
  endPoint: config().s3.endPoint,
  port: config().s3.port,
  useSSL: config().s3.ssl,
  accessKey: config().s3.accessKey,
  secretKey: config().s3.secretKey,
  region: config().s3.region
})

const bucket = config().s3.bucketName
const sourceFile = './files/profile.jpeg'

/** Listar */
const log = await minioClient.listBuckets()
console.log(`Buckets disponíveis:`, log)

const exists = await minioClient.bucketExists(bucket)

if (exists) {
  console.log('Bucket ' + bucket + ' exists.')
} else {
  await minioClient.makeBucket(bucket, 'us-east-1')
  console.log('Bucket ' + bucket + ' created in us-east-1.')
}

const metaData = {
  'Content-Type': 'image/jpeg',
  'X-Amz-Meta-Testing': 1234,
  example: 5678,
}

/** Upload */
// await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)

// console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)

/** Sign */
const objectName = 'user_profile.jpeg'
const expirationTime = 24 * 60 * 60 // 24 hours
const url = await getFileLinkToS3(minioClient, bucket, objectName, expirationTime)
console.log('url', url)





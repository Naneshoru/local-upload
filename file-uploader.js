import { Client } from 'minio'
import dotenv from 'dotenv'
import { signUrl } from './utils.js'

dotenv.config()

const minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  region: 'us-east-1'
})

const sourceFile = './files/profile.jpeg'

const bucket = 'personal-bucket'

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

const objectName = 'user_profile.jpeg'
const expirationTime = 24 * 60 * 60 // 24 hours
const url = await signUrl(minioClient, bucket, objectName, expirationTime)
console.log('url', url)

/** Upload */
// await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)

// console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)







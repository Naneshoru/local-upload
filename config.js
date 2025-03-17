

export default () => ({
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    endPoint: process.env.S3_ENDPOINT || 'localhost',
    port: parseInt(process.env.S3_PORT, 10) || 80,
    region: process.env.S3_REGION || 'us-east-1',
    ssl: process.env.S3_SSL ? true : false
  }
})
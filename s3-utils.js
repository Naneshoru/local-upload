async function createBucketIfNotExists(minioClient, bucket) {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, process.env.S3_REGION);
      console.log(`Bucket ${bucket} criado.`);
    }
  } catch (err) {
    console.error('Erro ao criar bucket:', err);
  }
}

// Retorna um stream do objeto armazenado no MinIO.
async function getFileFromS3 (minioClient, bucket, fileName) {
  const stream = await minioClient.getObject(bucket, fileName);
  return stream
}

async function getFileLinkToS3 (minioClient, bucket, objectName, expirationTime) {
  const downloadLink = await minioClient.presignedUrl('GET', bucket, objectName, expirationTime);
  return downloadLink
}

async function removeFileInS3 (minioClient, bucket, objectName) {
  await minioClient.removeObject(bucket, objectName)
}

export { getFileFromS3, getFileLinkToS3, removeFileInS3, createBucketIfNotExists }
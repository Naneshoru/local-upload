import fs from 'fs'

/** Buscar  */

// Retorna um stream do objeto armazenado no MinIO.

async function getFileFromS3 (minioClient, filePath) {
  const stream = await minioClient.getObject(bucket, 'user_profile.jpeg');
  
  const writeStream = fs.createWriteStream(filePath);
  stream.pipe(writeStream);
  
  writeStream.on('close', () => {
    console.log('Arquivo baixado com sucesso para', filePath);
  });

  return stream
}

async function getFileLinkToS3 (minioClient, bucket, objectName, expirationTime) {
  const downloadLink = await minioClient.presignedUrl('GET', bucket, objectName, expirationTime);
  return downloadLink
}

export { getFileFromS3, getFileLinkToS3 }
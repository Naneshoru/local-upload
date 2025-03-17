import fs from 'fs'

/** Buscar  */

// Retorna um stream do objeto armazenado no MinIO.

async function getFileStream (minioClient, filePath) {
  const stream = await minioClient.getObject(bucket, 'user_profile.jpeg');
  
  const writeStream = fs.createWriteStream(filePath);
  stream.pipe(writeStream);
  
  writeStream.on('close', () => {
    console.log('Arquivo baixado com sucesso para', filePath);
  });

  return stream
}

// Faz o download do arquivo diretamente para um arquivo no disco local.
/**
 * 
 * @param {*} objectPath 'user_profile.jpeg'
 * @param {*} downloadPath '/files/my_profile.jpeg'
 */
async function saveInDisk (minioClient, objectPath, downloadPath) {
  await minioClient.fGetObject(bucket, objectPath, downloadPath)
}

async function signUrl (minioClient, bucket, objectName, expirationTime) {
  const downloadLink = await minioClient.presignedUrl('GET', bucket, objectName, expirationTime);
  return downloadLink
}

export { getFileStream, saveInDisk, signUrl }
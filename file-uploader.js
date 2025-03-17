import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import multer from 'multer';
import config from './config.js'
import { Client } from 'minio'
import { createBucketIfNotExists } from './s3-utils.js'

const minioClient = new Client({
  endPoint: config().s3.endPoint,
  port: config().s3.port,
  useSSL: config().s3.ssl,
  accessKey: config().s3.accessKey,
  secretKey: config().s3.secretKey,
  region: config().s3.region
})

const bucket = config().s3.bucketName

const log = await minioClient.listBuckets()
console.log(`Buckets disponíveis:`, log)
createBucketIfNotExists(minioClient, bucket)

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error('Sem arquivo para upload.');
    }

    const fileName = file.originalname;

    const buffer = file.buffer;
    
    await minioClient.putObject(bucket, fileName, buffer);
    res.status(200).send({ message: 'Upload de arquivo com sucesso' });
  } catch (err) {
    console.error('Erro ao fazer upload de arquivo:', err);
    res.status(500).send({ error: 'Erro ao fazer upload de arquivo' });
  }
});

app.get('/download/:filename', async (req, res) => {
  try {
    const fileName = req.params.filename;
    console.log('Começando download do arquivo:', fileName);
    
    const stream = await minioClient.getObject(bucket, fileName);
    console.log('stream:', stream);
    
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    stream.pipe(res);
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).send({ error: 'Error downloading file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

/** Sign */
// const objectName = 'user_profile.jpeg'
// const expirationTime = 24 * 60 * 60 // 24 hours
// const url = await getFileLinkToS3(minioClient, bucket, objectName, expirationTime)
// console.log('url', url)

/** Remove */
// removeFileInS3(minioClient, bucket, objectName)





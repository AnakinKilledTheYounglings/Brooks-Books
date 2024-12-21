// backend/src/config/s3.js
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing S3 Client with:', {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set'
  }
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export default s3Client;
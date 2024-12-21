// backend/src/middleware/upload.js
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File filter running for:', file.originalname);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadToS3 = async (file) => {
  try {
    console.log('Starting S3 upload process...');
    console.log('Bucket:', process.env.AWS_BUCKET_NAME);
    console.log('Region:', process.env.AWS_REGION);
    
    const key = `drawings/${Date.now()}-${file.originalname}`;
    console.log('Generated S3 key:', key);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    console.log('Attempting S3 upload with params:', {
      ...params,
      Body: '[Buffer content]' // Don't log the actual buffer
    });

    const result = await s3Client.send(new PutObjectCommand(params));
    console.log('S3 upload successful:', result);

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log('Generated URL:', url);
    return url;

  } catch (error) {
    console.error('Detailed S3 Upload Error:', {
      message: error.message,
      code: error.code,
      requestId: error.$metadata?.requestId,
      details: error.details
    });
    throw new Error(`S3 Upload Failed: ${error.message}`);
  }
};

export { upload, uploadToS3 };
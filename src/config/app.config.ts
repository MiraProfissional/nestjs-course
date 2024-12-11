import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsCloudFront: process.env.AWS_CLOUDFRONT_URL,
  awsAcessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));

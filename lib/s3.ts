import { S3Client } from '@aws-sdk/client-s3'
import { env } from './env'

export const s3 = new S3Client({ region: env.AWS_REGION })
export const S3_URL = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com`

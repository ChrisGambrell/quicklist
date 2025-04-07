import {
	CreateBucketCommand,
	DeleteBucketCommand,
	DeletePublicAccessBlockCommand,
	PutBucketCorsCommand,
	PutBucketPolicyCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()

// a client can be shared by different commands.
const s3 = new S3Client()

async function main() {
	const Bucket = 'gambrelldev-quicklist-dev'

	await s3.send(new CreateBucketCommand({ Bucket }))
	await s3.send(new DeletePublicAccessBlockCommand({ Bucket }))
	await s3.send(
		new PutBucketPolicyCommand({
			Bucket,
			Policy: JSON.stringify({
				Version: '2012-10-17',
				Statement: [
					{
						Sid: 'PublicReadGetObject',
						Effect: 'Allow',
						Principal: '*',
						Action: 's3:GetObject',
						Resource: `arn:aws:s3:::${Bucket}/*`,
					},
				],
			}),
		})
	)
	await s3.send(
		new PutBucketCorsCommand({
			Bucket,
			CORSConfiguration: {
				CORSRules: [
					{
						AllowedHeaders: ['*'],
						AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
						AllowedOrigins: ['*'],
						ExposeHeaders: [],
					},
				],
			},
		})
	)

	await s3.send(new DeleteBucketCommand({ Bucket }))
}

main()

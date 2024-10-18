'use server'

import { env } from '@/lib/env'
import { s3, S3_URL } from '@/lib/s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

export async function uploadFile(file: File, path: string) {
	const fileExt = file.name.split('.').pop()
	const Key = `${path}/${new Date().getTime()}-${Math.random()}.${fileExt}`

	try {
		const { url, fields } = await createPresignedPost(s3, { Bucket: env.AWS_BUCKET_NAME, Key, Expires: 600 })

		const fd = new FormData()
		Object.entries(fields).forEach(([key, value]) => fd.append(key, value as string))
		fd.append('file', file)

		await fetch(url, { method: 'POST', body: fd })

		return `${S3_URL}/${Key}`
	} catch (error) {
		throw error
	}
}

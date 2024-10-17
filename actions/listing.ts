'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { env } from '@/lib/env'
import { s3, S3_URL } from '@/lib/s3'
import { updateListingSchema, uploadListingImageSchema } from '@/validators/listing'
import { _Object, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Listing, ListingImage } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing() {
	const user = await auth()
	const newListing = await prisma.listing.create({ data: { userId: user.id } })

	revalidatePath('/listings', 'layout')
	redirect(`/listings/${newListing.id}/edit`)
}

export async function updateListing({ listingId }: { listingId: Listing['id'] }, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateListingSchema)
	if (errors) return { errors }

	await prisma.listing.update({ where: { id: listingId }, data })

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing updated'))
}

export async function deleteListing({ listingId }: { listingId: Listing['id'] }) {
	await prisma.listing.delete({ where: { id: listingId } })

	revalidatePath('/listings', 'layout')
	redirect(getSuccessRedirect('/listings', 'Listing deleted'))
}

export async function uploadListingImage({ listingId }: { listingId: Listing['id'] }, _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, uploadListingImageSchema)
	if (errors) return { errors }

	const fileExt = data.file.name.split('.').pop()
	const Key = `listingImages/${listingId}/${new Date().getTime()}-${Math.random()}.${fileExt}`

	try {
		const { url, fields } = await createPresignedPost(s3, { Bucket: env.AWS_BUCKET_NAME, Key, Expires: 600 })

		const fd = new FormData()
		Object.entries(fields).forEach(([key, value]) => fd.append(key, value as string))
		fd.append('file', data.file)

		await fetch(url, { method: 'POST', body: fd })
		await prisma.listingImage.create({ data: { listingId, imagePath: `${S3_URL}/${Key}` } })
	} catch (error) {
		throw error
	}

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Image uploaded'))
}

// BUG: Need to do this with prisma
// export async function generateListingData({ listingId }: { listingId: Listing['id'] }) {
// 	const supabase = createClient()

// 	const { data, error } = await supabase.functions.invoke('generate-listing-details', { body: { listingId } })

// 	if (error || !data) {
// 		let errorMessage = error?.message ?? 'An unexpected error occurred'
// 		if (error instanceof FunctionsHttpError) {
// 			errorMessage = (await error.context.json()).error
// 		}
// 		redirect(
// 			getErrorRedirect(
// 				errorMessage === 'Not enough credits to generate data' ? '/pricing' : `/listings/${listingId}/edit`,
// 				errorMessage
// 			)
// 		)
// 	}

// 	revalidatePath(`/listings/${listingId}/edit`, 'page')
// 	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing data generated'))
// }

export async function deleteListingImage({ listingImageId }: { listingImageId: ListingImage['id'] }) {
	const listingImage = await prisma.listingImage.findUnique({ where: { id: listingImageId } })
	if (!listingImage) throw new Error('Listing image not found')

	await s3.send(new DeleteObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: listingImage.imagePath }))
	await prisma.listingImage.delete({ where: { id: listingImageId } })

	revalidatePath(`/listings/${listingImage.listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingImage.listingId}/edit`, 'Deleted successfully'))
}

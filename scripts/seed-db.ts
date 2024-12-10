import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const NUM_USERS = 10
const NUM_LISTINGS = NUM_USERS * 5

async function main() {
	await prisma.user.deleteMany({ where: { email: { not: 'christopher@gambrell.info' } } })
	await prisma.listing.deleteMany()
	await prisma.listingImage.deleteMany()
	await prisma.generation.deleteMany()
	await prisma.rule.deleteMany()

	await prisma.user.createMany({
		data: Array.from({ length: NUM_USERS - 1 }, () => {
			const firstName = faker.person.firstName()
			const lastName = faker.person.lastName()
			return {
				name: `${firstName} ${lastName}`,
				email: faker.internet.email({ firstName, lastName }),
				isAdmin: Math.random() <= 0.25,
			}
		}),
	})
	const users = await prisma.user.findMany()

	await prisma.listing.createMany({
		data: Array.from({ length: NUM_LISTINGS }, () => {
			const user = users[Math.floor(Math.random() * users.length)]
			return {
				title: faker.commerce.productName(),
				desc: faker.commerce.productDescription(),
				price: Number(faker.commerce.price()),
				userId: user.id,
			}
		}),
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

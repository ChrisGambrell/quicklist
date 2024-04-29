/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: '127.0.0.1' },
			{ hostname: 'avatars.githubusercontent.com' },
			{ hostname: 'lh3.googleusercontent.com' },
			{ hostname: 'ui.shadcn.com' },
		],
	},
}

export default nextConfig

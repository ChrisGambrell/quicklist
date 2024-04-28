export const getURL = (path: string = '') => {
	let url =
		process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
			? process.env.NEXT_PUBLIC_SITE_URL
			: process.env.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
			? process.env.NEXT_PUBLIC_VERCEL_URL
			: 'http://localhost:3000'

	console.log('getURL url:', url)

	// Trim the URL and remove trailing slash
	url = url.replace(/\/+$/, '')
	// Include https when not localhost
	url = url.includes('http') ? url : `https://${url}`
	// Ensure path starts without a slash to avoid duble slashes
	path = path.replace(/^\/+/, '')

	return path ? `${url}/${path}` : url
}

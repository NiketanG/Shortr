/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// redirect / to /home
	redirects() {
		return [
			{
				source: "/",
				destination: "/home",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;

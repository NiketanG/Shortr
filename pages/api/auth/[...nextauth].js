import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
	site: process.env.SITE,
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	secret: process.env.SECRET,
	// session: {
	// 	jwt: true,
	// },
	jwt: {},
	pages: {},
	callbacks: {},
	events: {},
	// database: process.env.DATABASE_URL
};

export default (req, res) => NextAuth(req, res, options);

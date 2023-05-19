import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
	secret:
		process.env.NEXTAUTH_SECRET || "C6C07B46-BAA9-4CB5-B3E1-870EC50630F8",
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
	],
};
export default NextAuth(authOptions);

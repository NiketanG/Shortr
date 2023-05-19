// Utilities
import { nanoid } from "nanoid";
import validUrl from "valid-url";
import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Url from "../../../models/Url";
import dbConnect from "../../../utils/db";
import axios from "axios";

const handler: NextApiHandler = async (req, res) => {
	const { method } = req;
	var session, userEmail;

	await dbConnect();
	switch (method) {
		case "GET":
			// Get list of all short urls by a particular user
			try {
				session = await getServerSession(req, res, authOptions);
				if (session) {
					// Sort by date
					const Urls = await Url.find({
						user: session.user?.email,
					}).select(["-__v"]);
					return res.status(200).json(Urls.reverse());
				} else {
					return res.status(401).json({
						code: "NOT_SIGNED_IN",
						message: "You need to be signed in to access that.",
					});
				}
			} catch (error) {
				console.log(error);
				return res.status(401).json({
					code: "SESSION_ERROR",
					message: "Some Error occured",
				});
			}
		case "POST":
			// Shorten
			// Create a new short url
			// Obtain parameters from Request body
			const { longUrl, customCode } = req.body;

			// Check if longUrl was provided, if not abort
			if (!longUrl) {
				return res.status(400).json({
					code: "NO_LONG_URL",
					message: "No long url provided",
				});
			}

			if (!validUrl.isUri(longUrl)) {
				return res.status(400).json({
					code: "INVALID_URL",
					message: "Invalid longUrl provided.",
				});
			}

			var urlCode;
			// Check if customCode was provided
			if (customCode) {
				const urlCustomCoded = await Url.findOne({
					urlCode: customCode,
				});

				// Check if customCode was already taken, if yes abort
				if (urlCustomCoded) {
					return res.status(400).json({
						code: "CUSTOM_CODE_NOT_AVAILABLE",
						message: "Custom code not available",
					});
				}
				urlCode = customCode;
			} else {
				urlCode = nanoid(10);
			}

			try {
				session = await getServerSession(req, res, authOptions);
				if (session) {
					userEmail = session.user?.email;
				} else {
					userEmail = null;
				}
			} catch (error) {
				console.log(error);
				return res.status(401).json({
					code: "SESSION_ERROR",
					message: "Some Error occured",
				});
			}
			// Create short url
			const shortUrl = process.env.SITE + "/" + urlCode;

			// Page title
			var title;
			// Fetch the page and obtain page title

			try {
				const pageResponse = await axios.get(longUrl);
				const body = await pageResponse.data;

				let temp = body.split("<title>")[1];
				if (temp) {
					title = temp.split("</title>")[0];
				}
			} catch (err) {
				console.error("[fetchPageTitle]", err);
				return res.status(400).json({
					code: "INVALID_URL",
					message: "Invalid url provided.",
				});
			}

			// Create a new URL
			const url = new Url({
				longUrl,
				urlCode,
				shortUrl,
				user: userEmail,
				title,
				visits: 0,
				countries: {},
				referers: {},
				timeline: {},
			});

			await url.save();
			return res.status(200).json(url);

		default:
			return;
	}
};

export default handler;

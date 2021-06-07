import Url from "../../../models/URLs";
import { setOptions, getSession } from "next-auth/client";

import fetch from "isomorphic-unfetch";
// Utilities
import { nanoid } from "nanoid";
import validUrl from "valid-url";

setOptions({ site: process.env.SITE });

export default async (req, res) => {
	const { method } = req;
	var session, userEmail;
	const baseUrl = process.env.SITE + "/";

	switch (method) {
		case "GET":
			// Get list of all short urls by a particular user
			try {
				session = await getSession({ req });
				if (session) {
					const Urls = await Url.find({
						user: session.user.email,
					}).select(["-__v", "-_id"]);
					return res.status(200).json(Urls);
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
				session = await getSession({ req });
				if (session) {
					userEmail = session.user.email;
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

			const pageResponse = await fetch(longUrl);
			const body = await pageResponse.text();
			if (body) {
				let temp = body.split("<title>")[1];
				if (temp) {
					title = temp.split("</title>")[0];
				}
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

		case "PUT":
			// Update a url
			const { urlCode: urlCodeToUpdate, newUrlCode } = req.body;
			if (!urlCodeToUpdate || !newUrlCode) {
				return res.status(400).json({
					code: "URL_CODE_NOT_PROVIDED",
					message: "Provide urlCode and newUrlCode.",
				});
			}

			try {
				session = await getSession({ req });
				if (session) {
					userEmail = session.user.email;
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

			const urlToUpdate = await Url.findOne({
				urlCode: urlCodeToUpdate,
			});

			const urlCustomCoded = await Url.findOne({
				urlCode: newUrlCode,
			});

			if (!urlToUpdate) {
				return res.status(404).json({
					code: "URL_NOT_FOUND",
					message: "URL with specified urlCode was not found.",
				});
			}
			if (urlToUpdate.user !== userEmail) {
				return res.status(401).json({
					code: "UNAUTHORIZED",
					message: "You are not authorized to access that.",
				});
			}
			// Check if newUrlCode was already taken, if yes abort
			if (urlCustomCoded) {
				return res.status(400).json({
					code: "CUSTOM_CODE_NOT_AVAILABLE",
					message: "Custom code not available",
				});
			}
			try {
				const updatedUrl = await Url.findOneAndUpdate(
					{ urlCode: urlCodeToUpdate, user: userEmail },
					{
						urlCode: newUrlCode,
						shortUrl: baseUrl + newUrlCode,
					},
					{ new: true }
				).select(["-__v", "-_id"]);
				return res.json(updatedUrl);
			} catch (error) {
				console.log(error);
				return res.status(500).json({
					code: "UPDATE_ERROR",
					message: "Internal Server Error occured while updating :/",
				});
			}
		case "DELETE":
			// Delete a url
			const { urlCode: urlCodeToDelete } = req.body;
			var userEmail;
			try {
				const session = await getSession({ req });
				if (session) {
					userEmail = session.user.email;
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
			try {
				const url = await Url.findOneAndDelete({
					urlCode: urlCodeToDelete,
					user: userEmail,
				});
				if (url) {
					return res.json({
						code: "SUCCESS",
						message: "Record was Deleted. ",
					});
				} else {
					return res.status(404).json({
						code: "NOT_FOUND",
						message:
							"Specified urlCode was not found. Make sure you are signed in if you created the Url while being signed in.",
					});
				}
			} catch (error) {
				console.log(error);
				return res.status(500).json({
					code: "DELETE_ERROR",
					message: "Internal Server Error occured while deleting the Record :/",
				});
			}
		default:
			return;
	}
};

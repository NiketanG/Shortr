import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Url from "../../../models/Url";
import dbConnect from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const id = req.query.id;
	try {
		var userEmail;
		try {
			const session = await getServerSession(req, res, authOptions);
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

		await dbConnect();

		if (req.method === "GET") {
			const url = await Url.findById(id);

			if (!url) {
				return res.status(404).json({
					code: "URL_NOT_FOUND",
					result: "URL with specified Id doesn't exist",
				});
			}

			if (url.user === userEmail) {
				return res.status(200).json(url);
			} else {
				return res.status(401).json({
					code: "UNAUTHORIZED",
					message: "You are not authorized to access that.",
				});
			}
		}

		if (req.method === "DELETE") {
			try {
				const url = await Url.findByIdAndDelete(id);
				if (url) {
					return res.json({
						code: "SUCCESS",
						message: "Record was Deleted.",
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
					message:
						"Internal Server Error occured while deleting the Record :/",
				});
			}
		}

		if (req.method === "PUT") {
			const { newUrlCode } = req.body;
			if (!id || !newUrlCode) {
				return res.status(400).json({
					code: "URL_CODE_NOT_PROVIDED",
					message: "Provide urlCode and newUrlCode.",
				});
			}

			const urlToUpdate = await Url.findById(id);

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

			const urlCustomCoded = await Url.findOne({
				urlCode: newUrlCode,
			});

			// Check if newUrlCode was already taken, if yes abort
			if (urlCustomCoded) {
				return res.status(400).json({
					code: "CUSTOM_CODE_NOT_AVAILABLE",
					message: "Custom code not available",
				});
			}
			try {
				urlToUpdate.urlCode = newUrlCode;
				urlToUpdate.shortUrl = process.env.SITE + "/" + newUrlCode;
				const updatedUrl = await urlToUpdate.save();
				return res.json(updatedUrl);
			} catch (error) {
				console.log(error);
				return res.status(500).json({
					code: "UPDATE_ERROR",
					message: "Internal Server Error occured while updating :/",
				});
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Some Error occured");
	}
};

export default handler;

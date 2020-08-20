import Url from "../../../models/URLs";
import { setOptions, getSession } from "next-auth/client";
setOptions({ site: process.env.SITE });

export default async (req, res) => {
	const {
		query: { urlCode },
	} = req;
	try {
		var userEmail;
		const session = await getSession({ req });
		if (session) {
			userEmail = session.user.email;
		} else {
			userEmail = null;
		}
		const url = await Url.findOne({ urlCode: urlCode });

		if (!url) {
			return res.status(404).json({
				code: "URL_NOT_FOUND",
				result: "URL with specified code doesn't exist",
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
	} catch (error) {
		console.log(error);
		return res.status(500).send("Some Error occured");
	}
};

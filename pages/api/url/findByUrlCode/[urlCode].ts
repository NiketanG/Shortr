import { NextApiRequest, NextApiResponse } from "next";
import Url, { URLItem } from "../../../../models/Url";
import dbConnect from "../../../../utils/db";
import iplocate from "../../../../utils/iplocate";

const updateStats = async (req: NextApiRequest, url: URLItem) => {
	const referer = req.headers["referer"] || "None";
	const ip = req.headers["x-forwarded-for"]?.toString()?.split(",")[0];
	let country;
	try {
		if (ip) {
			let ipData = await iplocate(ip);
			country = (ipData as any).country;
		}
	} catch (error) {
		console.log(error);
	}
	if (!country || country === "null") {
		country = "Others";
	}

	let countries = url.countries;
	countries[country] = (countries[country] || 0) + 1;

	let referers = url.referers;
	referers[referer] = (referers[referer] || 0) + 1;

	const currDate = new Date().toISOString().substr(0, 10);
	let timeline = url.timeline;
	timeline[currDate] = (timeline[currDate] || 0) + 1;

	Url.findByIdAndUpdate(url._id, {
		visits: url.visits + 1,
		countries: countries,
		referers: referers,
		timeline: timeline,
	}).catch((err) => {
		console.log(err);
	});
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const urlCode = req.query.urlCode;

	try {
		await dbConnect();

		if (req.method === "POST") {
			// Check API Key in header
			if (req.headers.authorization !== `Bearer ${process.env.API_KEY}`) {
				return res.status(401).json({
					code: "UNAUTHORIZED",
					result: "API Key is missing or invalid",
				});
			}

			const url = await Url.findOne({
				urlCode,
			});

			if (!url) {
				return res.status(404).json({
					code: "URL_NOT_FOUND",
					result: "URL with specified Id doesn't exist",
				});
			}

			updateStats(req, url);
			return res.status(200).json(url);
		} else {
			return res.status(405).json({
				code: "METHOD_NOT_ALLOWED",
				result: "Only POST requests allowed",
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Some Error occured");
	}
};

export default handler;

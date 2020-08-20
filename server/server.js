const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const { parse } = require("url");
const nextHandler = nextApp.getRequestHandler();
const iplocate = require("node-iplocate");
const app = require("express")();
const server = require("http").Server(app);
const Urls = require("../models/URLs");
const dbConnect = require("../utils/db");

nextApp
	.prepare()
	.then(async () => {
		await dbConnect();

		app.all("*", async (req, res) => {
			const parsedUrl = parse(req.url, true);
			const { pathname } = parsedUrl;

			const referer = req.headers.referer || "None";
			const ip = req.connection.remoteAddress || req.socket.remoteAddress;

			if (
				pathname === "/" ||
				pathname.includes("/api/") ||
				pathname.includes("/dashboard") ||
				pathname.includes("/_next/")
			) {
				return nextHandler(req, res, parsedUrl);
			} else {
				const url = await Urls.findOne({ urlCode: pathname.substr(1) });

				if (url) {
					res.writeHead(301, {
						Location: url.longUrl,
					}).end();

					let country;
					try {
						let ipData = await iplocate(ip);
						country = ipData.country;
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

					Urls.findByIdAndUpdate(url._id, {
						visits: url.visits + 1,
						countries: countries,
						referers: referers,
						timeline: timeline,
					})
						.then(() => {
							//empty
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					return nextHandler(req, res, parsedUrl);
				}
			}
		});

		server.listen(process.env.PORT, (err) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

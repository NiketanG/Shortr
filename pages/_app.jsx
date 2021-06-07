import { useState, useEffect } from "react";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";
import { Provider } from "next-auth/client";
import PropTypes from "prop-types";
import Head from "next/head";

const app = ({ Component, pageProps }) => {
	const [themeType, setThemeType] = useState("light");
	useEffect(() => {
		setThemeType(localStorage.getItem("theme") || "light");
	}, []);

	const switchTheme = () => {
		localStorage.setItem("theme", themeType === "dark" ? "light" : "dark");
		setThemeType((lastThemeType) => (lastThemeType === "dark" ? "light" : "dark"));
	};

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<meta name="keywords" content="Shortr URL Shortener Open Source Free" />

				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#317EFB" />

				<title>Shortr - URL Shortening done right</title>
				<meta name="title" content="Shortr - URL Shortening done right" />
				<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />

				<meta
					name="description"
					content="Shortr is a Free & Open Source URL Shortener focused on privacy. It supports Custom Short Urls and Realtime Statistics."
				/>

				<meta property="og:type" content="website" />
				<meta property="og:url" content="http://sh-rtr.herokuapp.com/" />
				<meta property="og:title" content="Shortr - URL Shortening done right" />
				<meta
					property="og:description"
					content="Shortr is a Free & Open Source URL Shortener focused on privacy. It supports Custom Short Urls and Realtime Statistics."
				/>

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="http://sh-rtr.herokuapp.com/" />
				<meta property="twitter:title" content="Shortr - URL Shortening done right" />
				<meta
					property="twitter:description"
					content="Shortr is a Free & Open Source URL Shortener focused on privacy. It supports Custom Short Urls and Realtime Statistics."
				/>
			</Head>
			<ZeitProvider theme={{ type: themeType }}>
				<CssBaseline />

				<Provider
					site={process.env.SITE}
					options={{ site: process.env.SITE }}
					session={pageProps.session}
				>
					<Component {...pageProps} changeTheme={switchTheme} />
				</Provider>
			</ZeitProvider>
		</>
	);
};

app.propTypes = {
	Component: PropTypes.func.isRequired,
	pageProps: PropTypes.object.isRequired,
};

export default app;

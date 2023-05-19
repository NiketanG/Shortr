/* eslint-disable react-hooks/rules-of-hooks */
import { CssBaseline, GeistProvider, Themes } from "@geist-ui/core";

import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useAppStore } from "../store";

const breakpoints = {
	xs: { min: "0", max: "640px" },
	sm: { min: "640px", max: "768px" },
	md: { min: "768px", max: "1024px" },
	lg: { min: "1024px", max: "1280px" },
	xl: { min: "1280px", max: "10000px" },
};

const app = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const theme = useAppStore((state) => state.theme);

	useEffect(() => {
		useAppStore.persist.rehydrate();
	}, []);

	const myThemeLight = Themes.createFromLight({
		type: "myThemeLight",
		breakpoints,
	});

	const myThemeDark = Themes.createFromDark({
		type: "myThemeDark",
		breakpoints,
	});

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<meta
					name="keywords"
					content="Shortr URL Shortener Open Source Free"
				/>

				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#317EFB" />

				<title>Shortr - URL Shortening done right</title>
				<meta
					name="title"
					content="Shortr - URL Shortening done right"
				/>
				<link
					rel="icon"
					href="/favicon.svg"
					sizes="any"
					type="image/svg+xml"
				/>

				<meta
					name="description"
					content="Shortr is a Free & Open Source URL Shortener focused on privacy. It supports Custom Short Urls and Realtime Statistics."
				/>

				<meta property="og:type" content="website" />
				<meta
					property="og:url"
					content="http://sh-rtr.herokuapp.com/"
				/>
				<meta
					property="og:title"
					content="Shortr - URL Shortening done right"
				/>
				<meta
					property="og:description"
					content="Shortr is a Free & Open Source URL Shortener focused on privacy. It supports Custom Short Urls and Realtime Statistics."
				/>

				<meta property="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:url"
					content="http://sh-rtr.herokuapp.com/"
				/>
				<meta
					property="twitter:title"
					content="Shortr - URL Shortening done right"
				/>
				<meta
					property="twitter:description"
					content="Shortr is a Free & Open Source URL Shortener focused on privacy. It supports Custom Short Urls and Realtime Statistics."
				/>
			</Head>
			<GeistProvider
				themeType={theme === "dark" ? "myThemeDark" : "myThemeLight"}
				themes={[myThemeLight, myThemeDark]}
			>
				<CssBaseline />

				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</GeistProvider>
		</>
	);
};

export default app;

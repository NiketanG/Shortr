import { useState, useEffect } from "react";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";
import { Provider } from "next-auth/client";
import PropTypes from "prop-types";

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
	);
};

app.propTypes = {
	Component: PropTypes.func.isRequired,
	pageProps: PropTypes.object.isRequired,
};

export default app;

import Document, { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from "@zeit-ui/react";

class pageDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		const styles = CssBaseline.flush();

		return {
			...initialProps,
			styles: (
				<>
					{initialProps.styles}
					{styles}
				</>
			),
		};
	}
	render() {
		return (
			<Html>
				<Head>
					<title>Shortr - URL Shortening done right</title>
					<meta name="title" content="Shortr - URL Shortening done right" />
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
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default pageDocument;

import { useState, useEffect } from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import useSWR from "swr";
import LinkSummary from "../../components/LinkSummary";
import Navbar from "../../components/Navbar";
import { Text } from "@zeit-ui/react";
import { DocumentProvider } from "mongoose";

const UrlStats = ({ urlCode, changeTheme }) => {
	const [selectedLink, setSelectedLink] = useState(null);
	const [authorised, setAuthorised] = useState(true);
	const [urlExists, setUrlExists] = useState(true);
	const getData = async () => {
		const res = await fetch(`/api/url/${urlCode}`);
		if (res.status === 401) {
			setAuthorised(false);
		}
		if (res.status === 404) {
			setUrlExists(false);
		}
		return res.json();
	};

	const { data } = useSWR(`/api/url/${urlCode}`, getData);

	useEffect(() => {
		if (data) {
			console.log(data.code);

			if (data.code === "UNAUTHORIZED") {
				setAuthorised(false);
				return;
			}
			if (data.code === "URL_NOT_FOUND") {
				setUrlExists(false);
				return;
			}
			setSelectedLink(data);
		}
	}, [data]);

	const updateLink = (oldUrlCode, newUrlCode) => {
		let updatedUrl = data;
		updatedUrl.urlCode = newUrlCode;
		updatedUrl.shortUrl = updatedUrl.shortUrl.replace(oldUrlCode, newUrlCode);
		setSelectedLink(updatedUrl);
	};

	const deleteLink = () => {
		setSelectedLink(null);
	};

	if (!urlExists) {
		return (
			<div>
				<div className="message">
					<Text h3>Not Found</Text>
					<Text p type="secondary">
						The Url Code provided was not found. Please make sure it is correct and try
						again.
					</Text>
				</div>
				<style jsx>{`
					.message {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						height: 100vh;
						text-align: center;
						margin: 0 10%;
					}
				`}</style>
			</div>
		);
	}
	if (!authorised) {
		return (
			<div>
				<div className="message">
					<Text h3>Unauthorised</Text>
					<Text p type="secondary">
						You are Unauthorised to access that Url Code. Make sure you are signed in
						with the correct account, if you created the Short Url while being signed
						in.
					</Text>
					<Text p type="secondary">
						If were signed out when you created the Short Url, you need to sign out
						again to access it.
					</Text>
				</div>
				<style jsx>{`
					.message {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						height: 100vh;
						text-align: center;
						margin: 0 10%;
					}
				`}</style>
			</div>
		);
	}

	return (
		<div className="container">
			<Head>
				<title>Shortr</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{selectedLink && (
				<main className="main">
					<Navbar toggleTheme={changeTheme} />

					<div className="content">
						<div className="linkSummary">
							<LinkSummary
								deleteLink={deleteLink}
								selectedLink={selectedLink}
								updateLink={updateLink}
							/>
						</div>
					</div>
				</main>
			)}
			<style jsx>
				{`
					.content {
						margin-top: 100px;
						display: flex;
						max-height: calc(100vh - 100px);
					}

					.linkSummary {
						width: 100vw;
						height: 100%;
						margin-bottom: 100px;
						overflow-y: auto;
					}

					@media screen and (min-width: 600px) {
						.content {
							justify-content: center;
						}
						.linkSummary {
							width: 80%;
						}
					}

					@media screen and (min-width: 962px) {
						.content {
							justify-content: center;
						}
						.linkSummary {
							width: 60%;
						}
					}
				`}
			</style>

			<style jsx global>
				{`
					html,
					body {
						padding: 0;
						margin: 0;
						font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
							Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
					}

					* {
						box-sizing: border-box;
					}
				`}
			</style>
		</div>
	);
};

UrlStats.propTypes = {
	urlCode: PropTypes.string.isRequired,
	changeTheme: PropTypes.func.isRequired,
};

UrlStats.defaultProps = {
	urlCode: null,
	changeTheme: null,
};

UrlStats.getInitialProps = async ({ query: { urlCode } }) => {
	return {
		urlCode,
	};
};

export default UrlStats;

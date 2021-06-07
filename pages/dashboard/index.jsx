import Head from "next/head";
import { Text } from "@zeit-ui/react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Navbar from "../../components/Navbar";
import LinksList from "../../components/LinksList";
import LinkSummary from "../../components/LinkSummary";

const Dashboard = ({ changeTheme }) => {
	const [selectedLink, setSelectedLink] = useState(null);

	const [links, setLinks] = useState(null);
	const getData = async () => {
		const res = await fetch("/api/url");
		return res.json();
	};

	const { data: urls } = useSWR("/api/url", getData);

	useEffect(() => {
		if (urls) setLinks(urls);
	}, [urls]);

	const selectLink = (urlCode) => setSelectedLink(urls.find((url) => url.urlCode === urlCode));

	const deleteLink = (deletedLinkCode) => {
		setSelectedLink(null);
		setLinks(links.filter((link) => link.urlCode !== deletedLinkCode));
	};

	const updateLink = (oldUrlCode, newUrlCode) => {
		let tempUrls = [...links];
		const updatedIndex = tempUrls.findIndex((el) => el.urlCode === oldUrlCode);
		let updatedUrl = { ...tempUrls[updatedIndex] };
		updatedUrl.urlCode = newUrlCode;
		updatedUrl.shortUrl = updatedUrl.shortUrl.replace(oldUrlCode, newUrlCode);
		tempUrls[updatedIndex] = updatedUrl;
		setLinks(tempUrls);
		setSelectedLink(updatedUrl);
	};

	const addNewUrl = (urlData) => {
		let tempLinks = links;
		tempLinks.push(urlData);
		setLinks(tempLinks);
	};

	return (
		<div className="container">
			<Head>
				<title>Shortr - Dashboard</title>
			</Head>

			<main className="main">
				<Navbar toggleTheme={changeTheme} />
				<div className="content">
					<div className="links">
						<LinksList links={links} selectLink={selectLink} addNewUrl={addNewUrl} />
					</div>
					<div className="linkSummary">
						{selectedLink !== null ? (
							<LinkSummary
								selectedLink={selectedLink}
								deleteLink={deleteLink}
								updateLink={updateLink}
							/>
						) : (
							<div className="linkContentBlank">
								<Text h4 type="secondary">
									Select a link from the list to view stats
								</Text>
							</div>
						)}
					</div>
				</div>
			</main>

			<style jsx>
				{`
					.content {
						margin-top: 100px;
						display: flex;

						overflow-y: none;
						max-height: calc(100vh - 100px);
					}
					.links {
						max-width: 300px;
						max-height: calc(100vh - 100px);
					}
					.linkSummary {
						display: none;
						width: 100%;
						overflow-y: auto;
					}
					.linkContentBlank {
						display: none;
					}

					@media screen and (min-width: 652px) {
						.linkContentBlank {
							height: calc(100vh - 100px);
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.linkSummary {
							display: block;
						}
					}
					@media screen and (min-width: 962px) {
						.content {
							justify-content: center;
						}
						.linkSummary {
							width: 50%;
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

export default Dashboard;

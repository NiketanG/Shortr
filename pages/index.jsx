import Link from "next/link";
import { useTheme, useToasts, Button, Text, Card, Divider, Input } from "@zeit-ui/react";
import React, { useState, useEffect } from "react";
import { ArrowRight, Link2 } from "@zeit-ui/react-icons";
import fetch from "unfetch";
import { useSession, signin } from "next-auth/client";

const GoogleIcon = () => <img src="/google.svg" alt="Google Logo" width={16} height="auto" />;

const Home = () => {
	const { palette } = useTheme();
	const [urlToShorten, setUrlToShorten] = useState("");
	const [isLoadingShortner, setIsLoadingShortner] = useState(false);
	const [linkId, setLinkId] = useState("");

	const [shortened, setShortened] = useState(false);

	const [session, loadingLogin] = useSession();

	const [, setToast] = useToasts();

	useEffect(() => {
		if (session) {
			setToast({ text: "Logged In" });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const shorten = () => {
		setIsLoadingShortner(true);
		var longUrl = urlToShorten;
		if (!(urlToShorten.includes("http://") || urlToShorten.includes("https://"))) {
			longUrl = "http://" + urlToShorten;
		}

		fetch("/api/url", {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ longUrl }),
		})
			.then((response) => {
				if (response.ok) {
					response.json().then((data) => {
						setLinkId(data.urlCode);
						setShortened(true);
						setToast({ text: "Shortened" });
					});
				} else {
					setToast({ text: "Some error occured" });
				}
			})

			.catch((err) => {
				console.log(err);
				setShortened(false);
				setToast({ text: "Some error occured" });
			})
			.finally(() => {
				setIsLoadingShortner(false);
			});
	};

	return (
		<div className="container">
			<main>
				<h1 className="title">Shortr</h1>

				<div className="description">
					<Text>Shrink your URLs</Text>
					{session ? (
						<Link href="/dashboard">
							<Button shadow type="success" loading={loadingLogin}>
								<a>View Dashboard</a>
							</Button>
						</Link>
					) : (
						<Button
							size="large"
							loading={loadingLogin}
							shadow
							icon={<GoogleIcon />}
							onClick={() =>
								signin("google", {
									callbackUrl: `${process.env.SITE}/dashboard`,
								})
							}
						>
							Login with Google
						</Button>
					)}
				</div>

				<div className="shorten">
					<Text h5>Try it once</Text>
					<div className="shortenInput">
						<Input
							inputMode="url"
							icon={<Link2 />}
							placeholder="Enter Url to Shorten"
							value={urlToShorten}
							onChange={(e) => setUrlToShorten(e.target.value)}
						/>

						<Button
							style={{ margin: "0 10px" }}
							loading={isLoadingShortner}
							size="small"
							onClick={shorten}
							disabled={!urlToShorten.length > 0}
							iconRight={<ArrowRight />}
						>
							Shorten
						</Button>
					</div>

					{shortened && (
						<Text p style={{ textAlign: "center" }}>
							Your Shortr Url is&nbsp;
							<a
								href={process.env.NEXT_PUBLIC_SITE + "/" + linkId}
								style={{ color: palette.successDark }}
							>
								{process.env.NEXT_PUBLIC_SITE + "/" + linkId}
							</a>
							<br />
							You can view Link Statistics by clicking&nbsp;
							<Link href={`/dashboard/${linkId}`}>
								<a style={{ color: palette.successDark }}>here.</a>
							</Link>
						</Text>
					)}
				</div>

				<Text h3 style={{ marginTop: 50 }}>
					Why Shortr ?
				</Text>

				<div className="grid">
					<div className="card">
						<Card>
							<Card.Content>
								<Text b>Statistics</Text>
							</Card.Content>
							<Divider y={0} />
							<Card.Content>
								<Text>
									Granular Statistics like Country of Visitor/s, Referers and Date
									of visit.
								</Text>
							</Card.Content>
						</Card>
					</div>

					<div className="card">
						<Card>
							<Card.Content>
								<Text b>Custom Links</Text>
							</Card.Content>
							<Divider y={0} />
							<Card.Content>
								<Text>
									Use a custom<sup>*</sup> shortened URL for your Website.
								</Text>
							</Card.Content>
						</Card>
					</div>
				</div>
			</main>

			<Text style={{ color: palette.accents_5 }} p size={12}>
				*You can use any Custom URL as long as it is unique, and not already taken.{" "}
			</Text>

			<footer>
				<a href="https://niketang.github.io" target="_blank" rel="noopener noreferrer">
					Developed by Niketan Gulekar
				</a>
				<a
					href="https://github.com/NiketanG/shortr"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Text style={{ margin: 0 }} type="secondary">
						Source Code
					</Text>
				</a>
			</footer>

			<style jsx>{`
				.container {
					background-color: ${palette.background};
					min-height: 100vh;
					padding: 0 0.5rem;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				main {
					padding: 5em 0em;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				.shorten {
					display: flex;
					align-items: center;
					flex-direction: column;
				}

				.shortenInput {
					display: flex;
					align-items: center;
					flex-direction: row;
				}

				@media only screen and (max-width: 600px) {
					.shortenInput {
						display: flex;
						align-items: center;
						flex-direction: column;
						height: 80px;
						justify-content: space-between;
					}
				}

				.grid {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
				}

				.card {
					width: 80%;
					margin: 5px 0;
				}

				@media only screen and (min-width: 600px) {
					.grid {
						flex-direction: row;
					}

					main {
						padding: 5em 5em;
					}

					.card {
						width: 50%;
						margin: 20px;
					}
				}

				footer {
					width: 100%;
					height: 100px;
					border-top: 1px solid ${palette.accents_2};
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				a {
					color: inherit;
					text-decoration: none;
				}

				.title {
					text-decoration: none;
				}

				.title:hover,
				.title:focus,
				.title:active {
					text-decoration: underline;
				}

				.title {
					margin: 0;
					line-height: 1.15;
					font-size: 4rem;
				}
				.description {
					line-height: 1.5;
					margin: 0 0 50px 0;
					text-align: center;
					font-size: 1.5rem;
				}
			`}</style>

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
						Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
					background-color: ${palette.background};
					color: ${palette.foreground};
				}

				* {
					box-sizing: border-box;
				}
			`}</style>
		</div>
	);
};

export default Home;

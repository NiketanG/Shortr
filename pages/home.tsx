import {
	Button,
	Card,
	Divider,
	Grid,
	Input,
	Text,
	useClipboard,
	useTheme,
	useToasts,
} from "@geist-ui/core";
import { ArrowRight, Link2 } from "@geist-ui/icons";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import validUrl from "valid-url";

const GoogleIcon = () => (
	<Image src="/images/google.svg" alt="Google Logo" width={16} height={16} />
);

const Home = () => {
	const { palette } = useTheme();

	const [urlToShorten, setUrlToShorten] = useState("");
	const [isLoadingShortner, setIsLoadingShortner] = useState(false);
	const [linkId, setLinkId] = useState<string | null>(null);
	const [linkCustomCode, setLinkCustomCode] = useState<string | null>(null);

	const { data: session, status } = useSession();

	const { setToast } = useToasts();

	useEffect(() => {
		if (session) {
			setToast({ text: "Logged In" });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const router = useRouter();
	const { copy: copyToClipboard } = useClipboard();

	const shorten = async () => {
		var longUrl = urlToShorten;
		if (
			!(
				urlToShorten.includes("http://") ||
				urlToShorten.includes("https://")
			)
		) {
			longUrl = "http://" + urlToShorten;
		}

		if (!validUrl.isWebUri(longUrl)) {
			setToast({
				text: (
					<Text b marginBottom={0}>
						Please enter a valid URL
					</Text>
				),
				type: "error",
			});
			return;
		}

		setIsLoadingShortner(true);

		try {
			const response = await axios.post(
				"/api/url",
				{ longUrl },
				{
					withCredentials: true,
				}
			);

			if (response?.data) {
				setLinkCustomCode(response.data.urlCode);
				setLinkId(response.data._id);
				copyToClipboard(
					process.env.NEXT_PUBLIC_SITE + "/" + response.data.urlCode
				);
				setToast({
					type: "success",
					text: (
						<div>
							<Text b marginTop={0} marginBottom={0} small>
								<Text mt={0} mb={0} b>
									Shortened & Copied to Clipboard.
								</Text>
							</Text>
							<Text p marginTop={0} marginBottom={0} small>
								{process.env.NEXT_PUBLIC_SITE +
									"/" +
									response.data.urlCode}
							</Text>
						</div>
					),
				});
				// Wait for 2 seconds and redirect to dashboard
				setTimeout(() => {
					router.push(`/dashboard/${response.data._id}`);
				}, 2000);
			} else {
				setToast({
					text: (
						<div>
							<Text b marginBottom={0}>
								An error occured
							</Text>
							{response?.data?.message ? (
								<Text p marginTop={0} marginBottom={0} small>
									{response.data.message}
								</Text>
							) : null}
						</div>
					),
					type: "error",
				});
			}
		} catch (error) {
			console.error(error);
			setToast({
				text: (
					<div>
						<Text b marginBottom={0}>
							An error occured
						</Text>
						{(error as any)?.response?.data?.message ? (
							<Text p marginTop={0} marginBottom={0} small>
								{(error as any).response.data.message}
							</Text>
						) : null}
					</div>
				),
				type: "error",
			});
		} finally {
			setIsLoadingShortner(false);
		}
	};

	const signInWithGoogle = () => {
		return signIn("google", {
			callbackUrl: "/dashboard",
		});
	};

	return (
		<main className="container">
			<Grid.Container justify="center" gap={0}>
				<Grid xs={24} md={24} justify="center">
					<Text h1>Shortr</Text>
				</Grid>
				<Grid xs={24} md={24} marginTop={-2} justify="center">
					<Text>Shrink your URLs</Text>
				</Grid>
				<Grid xs={24} md={24} justify="center">
					{session ? (
						<Link href="/dashboard">
							<Button
								shadow
								type="success"
								loading={(status as any) === "loading"}
							>
								View Dashboard
							</Button>
						</Link>
					) : (
						<Button
							icon={<GoogleIcon />}
							auto
							type="secondary"
							shadow
							loading={(status as any) === "loading"}
							onClick={signInWithGoogle}
						>
							Continue with Google
						</Button>
					)}
				</Grid>
			</Grid.Container>

			<div>
				<Text
					h5
					marginTop={2}
					style={{
						textAlign: "center",
						width: "100%",
					}}
				>
					Try it once
				</Text>
				<Grid.Container
					gap={1}
					marginTop={-1}
					justify="center"
					alignContent="center"
					alignItems="center"
				>
					<Grid marginTop={0.2} width="1/3">
						<Input
							inputMode="url"
							icon={<Link2 />}
							placeholder="Enter Url to Shorten"
							value={urlToShorten}
							onChange={(e) => setUrlToShorten(e.target.value)}
						/>
					</Grid>
					<Grid>
						<Button
							type="success"
							loading={isLoadingShortner}
							onClick={shorten}
							disabled={urlToShorten.length > 0 ? false : true}
							iconRight={<ArrowRight />}
						>
							Shorten
						</Button>
					</Grid>
				</Grid.Container>

				{linkId !== null && linkCustomCode !== null && (
					<Text p style={{ textAlign: "center", width: "100%" }}>
						Your Shortr Url is&nbsp;
						<Text b>
							<a
								href={
									process.env.NEXT_PUBLIC_SITE +
									"/" +
									linkCustomCode
								}
								style={{ color: palette.successDark }}
							>
								{process.env.NEXT_PUBLIC_SITE +
									"/" +
									linkCustomCode}
							</a>
						</Text>
						<br />
						You can view Link Statistics&nbsp;
						<Link
							href={`/dashboard/${linkId}`}
							style={{ color: palette.successDark }}
						>
							here.
						</Link>
						<br />
						<Text small>
							Redirecting to Dashboard in 2 seconds.
						</Text>
					</Text>
				)}
			</div>

			<Text
				h3
				style={{
					marginTop: 50,
					textAlign: "center",
					width: "100%",
				}}
			>
				Why Shortr ?
			</Text>

			<Grid.Container gap={1} width={"100%"} justify="center">
				<Grid xs={12} md={10}>
					<Card width={"100%"}>
						<Card.Content>
							<Text b>Statistics</Text>
						</Card.Content>
						<Divider />
						<Card.Content>
							<Text>
								Granular Statistics like Country of Visitor/s,
								Referers and Date of visit.
							</Text>
						</Card.Content>
					</Card>
				</Grid>
				<Grid xs={12} md={10}>
					<Card width={"100%"}>
						<Card.Content>
							<Text b>Custom Links</Text>
						</Card.Content>
						<Divider />
						<Card.Content>
							<Text>
								Use a custom<sup>*</sup> shortened URL for your
								Website.
							</Text>
						</Card.Content>
					</Card>
				</Grid>
			</Grid.Container>

			<Text
				style={{
					color: palette.accents_5,
					width: "100%",
					textAlign: "center",
				}}
				p
			>
				*You can use any Custom URL as long as it is unique, and not
				already taken.{" "}
			</Text>

			<footer className="footer">
				<a
					href="https://niketang.github.io"
					target="_blank"
					rel="noopener noreferrer"
				>
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
				.title {
					text-decoration: none;
				}

				.title:hover,
				.title:focus,
				.title:active {
					text-decoration: underline;
				}

				.footer {
					width: 100%;
					height: 100px;
					border-top: 1px solid ${palette.accents_2};
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				.container {
					padding: 1rem;
				}

				// Only for screen width >= 768px
				@media (min-width: 768px) {
					.container {
						padding: 4rem;
					}
				}
			`}</style>
		</main>
	);
};

export default Home;

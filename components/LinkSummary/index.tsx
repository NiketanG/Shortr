import { useState, useEffect, KeyboardEventHandler } from "react";
import {
	useTheme,
	Modal,
	Text,
	Button,
	useToasts,
	useClipboard,
	Input,
	Dot,
	Divider,
	Grid,
} from "@geist-ui/core";
import { Copy, Edit2, Delete, ArrowRight, ArrowLeft } from "@geist-ui/icons";
import ContentLoader from "react-content-loader";
import {
	Chart as ChartJS,
	CategoryScale,
	ArcElement,
	Tooltip,
	Legend,
	LinearScale,
	PointElement,
	LineElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement
);

import { useRouter } from "next/router";
import useSWR from "swr";
import Head from "next/head";
import { useSession } from "next-auth/react";
import axios from "axios";
import { URLItem } from "../../models/Url";
const colorsList = [
	"#E57373",
	"#F48FB1",
	"#9FA8DA",
	"#81D4FA",
	"#80CBC4",
	"#CE93D8",
	"#AED581",
	"#DCE775",
	"#FFF176",
	"#FFB74D",
	"#FF8A65",
	"#4DD0E1",
];

const colorsList2 = [
	"#4DD0E1",
	"#FF8A65",
	"#FFB74D",
	"#FFF176",
	"#DCE775",
	"#AED581",
	"#CE93D8",
	"#80CBC4",
	"#81D4FA",
	"#9FA8DA",
	"#F48FB1",
	"#E57373",
];

const NotFound = () => (
	<div className="message">
		<Text h3>Not Found</Text>
		<Text p type="secondary" mt={0}>
			The URL Code provided was not found. Please make sure it is correct
			and try again.
		</Text>
	</div>
);

const fetchSelectedLink = async (slug: string) => {
	const res = await axios.get<URLItem>(`/api/url/${slug}`, {
		withCredentials: true,
	});
	return res.data;
};

const LinkSummary = ({ slug }: { slug: string }) => {
	const router = useRouter();

	const {
		data: selectedLink,
		isLoading,
		error,
		mutate,
	} = useSWR(slug, fetchSelectedLink);

	const backToDashboard = () => {
		router.push("/dashboard");
	};

	const { palette } = useTheme();

	const [customUrl, setCustomUrl] = useState("");

	const [deleteModal, setDeleteModal] = useState(false);

	const [editEnabled, setEditEnabled] = useState(false);
	const [isLoading_CustomUrl, setIsLoading_CustomUrl] = useState(false);
	const [customUrlAvailable, setCustomUrlAvailable] = useState(true);
	const { data: session } = useSession();
	const { copy } = useClipboard();
	const { setToast } = useToasts();

	const [countryList, setCountryList] = useState<string[]>([]);
	const [refererList, setRefererList] = useState<string[]>([]);
	const [timelineList, setTimelineList] = useState<string[]>([]);
	const [visitorsData, setVisitorsData] = useState<number[]>([]);
	const [referersData, setReferersData] = useState<number[]>([]);
	const [timelineData, setTimelineData] = useState<number[]>([]);

	useEffect(() => {
		if (selectedLink) {
			setCountryList(Object.keys(selectedLink.countries));
			setRefererList(Object.keys(selectedLink.referers));
			setVisitorsData(Object.values(selectedLink.countries));
			setReferersData(Object.values(selectedLink.referers));
			setTimelineList(
				Object.keys(selectedLink.timeline).map((date) =>
					new Date(date).toLocaleDateString()
				)
			);
			setTimelineData(Object.values(selectedLink.timeline));
		}
		setCustomUrl("");
		setEditEnabled(false);
		setIsLoading_CustomUrl(false);
		setCustomUrlAvailable(true);
	}, [selectedLink]);

	const updateCustomUrl = async () => {
		if (!selectedLink) return;
		if (customUrl.length <= 0) {
			setToast({ text: "Custom Url can't be empty." });
			return;
		}

		try {
			setIsLoading_CustomUrl(true);
			const res = await fetch(`/api/url/${selectedLink?._id}`, {
				credentials: "include",
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					newUrlCode: customUrl,
				}),
			});
			const data = await res.json();
			if (data.code === "CUSTOM_CODE_NOT_AVAILABLE") {
				setCustomUrlAvailable(false);
				return;
			}
			if (res.ok) {
				setCustomUrlAvailable(true);
				setToast({ text: "Updated link Url" });
				setEditEnabled(false);
				mutate({
					...selectedLink,
					urlCode: customUrl,
				});
			}
			setIsLoading_CustomUrl(false);
		} catch (error) {
			console.log(JSON.stringify(error, null, 2));
			setToast({ text: "Some Error Occured" });
			setIsLoading_CustomUrl(false);
		}
	};

	const [isDeleting, setIsDeleting] = useState(false);
	const deleteShortUrl = async () => {
		if (!selectedLink) return;
		try {
			setIsDeleting(true);
			const res = await fetch(`/api/url/${selectedLink._id}`, {
				credentials: "include",
				method: "DELETE",
			});
			if (!res.ok) {
				const data = await res.json();
				setToast({
					text: data.message || "Some Error Occured",
					type: "error",
				});
				return;
			} else {
				setDeleteModal(false);
				setToast({ text: "Deleted" });
				if (session) {
					router.replace("/dashboard");
				} else {
					router.replace("/");
				}
			}
		} catch (err) {
			console.error(JSON.stringify(err));
			setToast({
				text: "Some Error Occured",
				type: "error",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const copyLink = (link: string) => {
		copy(link);
		setToast({ text: "Link Copied" });
	};

	const shuffleArray = (array: any[], n = 0.5) => {
		return array.sort(() => n - Math.random());
	};

	const referersChartData = {
		labels: refererList,
		datasets: [
			{
				backgroundColor: shuffleArray(colorsList2),
				data: referersData,
			},
		],
	};

	const editInputKeyUp = (e: KeyboardEvent) => {
		if (customUrl.length > 2 && e.keyCode === 13) {
			updateCustomUrl();
		}
	};

	return (
		<div className="container">
			{error?.response?.status === 404 && <NotFound />}

			{error?.response?.data?.code === "UNAUTHORIZED" && (
				<div className="message">
					<Text h3>Unauthorised</Text>
					<Text p type="secondary">
						You are Unauthorised to access that Url Code. Make sure
						you are signed in with the correct account, if you
						created the Short Url while being signed in.
					</Text>
					<Text p type="secondary">
						If were signed out when you created the Short Url, you
						need to sign out again to access it.
					</Text>
				</div>
			)}

			<Modal visible={deleteModal} onClose={() => setDeleteModal(false)}>
				<Modal.Title>Delete</Modal.Title>
				<Modal.Subtitle>Are you sure ?</Modal.Subtitle>
				<Modal.Content>
					<Text p>
						This can&apos;t be undone. The Short url will no longer
						redirect you to your URL.
					</Text>
				</Modal.Content>
				<Modal.Action passive onClick={() => setDeleteModal(false)}>
					Cancel
				</Modal.Action>
				<Modal.Action loading={isDeleting} onClick={deleteShortUrl}>
					Delete
				</Modal.Action>
			</Modal>

			<div className="linkSummary">
				<>
					<Head>
						<title>
							{selectedLink?.title
								? `Shortr - ${selectedLink?.title}`
								: "Shortr - URL Shortening done right"}
						</title>
					</Head>
					<Button
						auto
						icon={<ArrowLeft />}
						mb={1}
						onClick={backToDashboard}
					>
						Back to Dashboard
					</Button>
					<div className="linkDetails">
						<Grid.Container
							gap={0}
							wrap="wrap"
							justify="space-between"
						>
							<Grid
								xs={24}
								lg={14}
								md={20}
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								{isLoading && !selectedLink ? (
									<ContentLoader
										uniqueKey="nikketan"
										width={228}
										height={68}
										viewBox="0 0 228 68"
									>
										<rect
											x="0"
											y="0"
											rx="5"
											ry="5"
											width="228"
											height="10"
										/>
										<rect
											x="0"
											y="20"
											rx="8"
											ry="8"
											width="144"
											height="16"
										/>
										<rect
											x="0"
											y="46"
											rx="5"
											ry="5"
											width="164"
											height="10"
										/>
									</ContentLoader>
								) : (
									<>
										{selectedLink ? (
											<Text small type="secondary">
												Created on{" "}
												{new Date(
													selectedLink.dateCreated
												)
													.toString()
													.substr(0, 24)}
											</Text>
										) : null}

										<Text style={{ margin: 0 }} h3>
											{selectedLink?.title ||
												selectedLink?.longUrl}
										</Text>

										<Text small type="secondary">
											<a href={selectedLink?.longUrl}>
												{selectedLink?.longUrl}
											</a>
										</Text>
									</>
								)}
								<Text className="shortUrl" type="success">
									{isLoading && !selectedLink ? (
										<ContentLoader
											uniqueKey="nikketan"
											width={228}
											height={10}
											viewBox="0 0 228 10"
										>
											<rect
												x="0"
												y="0"
												rx="5"
												ry="5"
												width="228"
												height="10"
											/>
										</ContentLoader>
									) : (
										<a href={selectedLink?.shortUrl}>
											{selectedLink?.shortUrl}
										</a>
									)}
								</Text>
							</Grid>

							<Grid.Container xs={24} md={4} lg={10} gap={1}>
								<Grid md={24} lg={8}>
									<Button
										auto
										className="linkButton"
										onClick={() =>
											selectedLink &&
											copyLink(selectedLink?.shortUrl)
										}
										icon={<Copy />}
									>
										Copy
									</Button>
								</Grid>
								<Grid md={24} lg={8}>
									<Button
										auto
										mr={0}
										className="linkButton"
										icon={<Edit2 />}
										onClick={() =>
											setEditEnabled(!editEnabled)
										}
									>
										Edit
									</Button>
								</Grid>
								<Grid md={24} lg={8}>
									<Button
										auto
										ml={0}
										className="linkButton"
										type="error-light"
										icon={<Delete />}
										onClick={() => setDeleteModal(true)}
									>
										Delete
									</Button>
								</Grid>
							</Grid.Container>
						</Grid.Container>
						{editEnabled && (
							<Grid.Container mt={1} gap={1} alignItems="center">
								<Grid xs={24} md={8}>
									<Input
										width={"100%"}
										label="https://short.tr/"
										placeholder={selectedLink?.urlCode}
										value={customUrl}
										className="editInput"
										onKeyUp={editInputKeyUp as any}
										onChange={(e) =>
											setCustomUrl(e.target.value)
										}
									>
										{!customUrlAvailable && (
											<Dot type="error">
												Custom URL already taken, try a
												different one
											</Dot>
										)}
									</Input>
								</Grid>
								<Grid xs={24} md={4}>
									<Button
										width={"100%"}
										type="secondary"
										loading={isLoading_CustomUrl}
										iconRight={<ArrowRight />}
										onClick={updateCustomUrl}
									>
										Submit
									</Button>
								</Grid>
							</Grid.Container>
						)}
						<Divider />

						{isLoading && !selectedLink ? (
							<div>
								<ContentLoader
									uniqueKey="loader_visits"
									width={112}
									height={10}
									viewBox="0 0 112 10"
								>
									<rect
										x="0"
										y="0"
										rx="5"
										ry="5"
										width="112"
										height="10"
									/>
								</ContentLoader>
								<ContentLoader
									uniqueKey="loader_charts"
									width="100%"
									height={600}
									viewBox="0 0 600 600"
								>
									<rect
										x="0"
										y="50"
										rx="5"
										ry="5"
										width="100%"
										height="250"
									/>
									<rect
										x="0"
										y="350"
										rx="5"
										ry="5"
										width="100%"
										height="250"
									/>
								</ContentLoader>
							</div>
						) : (
							<div>
								<Text
									type="secondary"
									small
									style={{ letterSpacing: 1 }}
								>
									Total Visits : <b>{selectedLink?.visits}</b>
								</Text>

								{selectedLink && selectedLink?.visits > 0 ? (
									<>
										<Text mt={1} mb={0}>
											<b>Visitors Timeline</b>
										</Text>
										<Line
											title="Visits Timeline"
											data={{
												labels: timelineList,
												datasets: [
													{
														label: "Visits",
														data: timelineData,
														pointBorderWidth: 3,
														backgroundColor:
															palette.violetLighter,
														borderColor:
															palette.violet,
														borderWidth: 2,
														borderJoinStyle:
															"round",
														pointRadius: 5,
														pointBorderColor:
															palette.background,
														pointBackgroundColor:
															palette.violetDark,
													},
												],
											}}
										/>
									</>
								) : null}
								<Grid.Container mt={1} gap={2}>
									<Grid
										xs={24}
										md={12}
										style={{
											borderRight: `1px solid ${palette.accents_2}`,
										}}
									>
										<div>
											<Text mt={0}>
												<b>Visitors by Countries</b>
											</Text>
											{countryList?.length === 0 ? (
												<Text p small>
													No Data Available yet for
													Countries.
													<br />
													Check back later
												</Text>
											) : (
												<Doughnut
													title="Countries"
													data={{
														labels: countryList,
														datasets: [
															{
																backgroundColor:
																	shuffleArray(
																		colorsList
																	),
																data: visitorsData,
																label: "Countries",
															},
														],
													}}
												/>
											)}
										</div>
									</Grid>
									<Grid xs={24} md={12}>
										<div>
											<Text mt={0}>
												<b>Visitors by Referrers</b>
											</Text>
											{countryList?.length === 0 ? (
												<Text p small>
													No Data Available yet for
													Referrers.
													<br />
													Check back later
												</Text>
											) : (
												<Doughnut
													data={referersChartData}
													title="Referers"
												/>
											)}
										</div>
									</Grid>
								</Grid.Container>
							</div>
						)}
					</div>
				</>
			</div>
			<style jsx>
				{`
					.container {
						width: 100%;
						height: calc(100vh - 86px);
						overflow-y: auto;
						padding: 10px 0 20px 0;
						overflow-x: hidden;
					}
					.linkDetails {
						display: flex;
						flex-direction: column;
						max-width: calc(100% - 30px);
					}

					.message {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						text-align: center;
					}

					a {
						color: inherit;
						text-decoration: none;
					}

					.editLink {
						display: flex;
						margin-top: 25px;
						flex-direction: column;
						width: 100%;
						height: 120px;
						align-items: center;
						justify-content: space-evenly;
					}
				`}
			</style>
		</div>
	);
};

export default LinkSummary;

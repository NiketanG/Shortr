import { useState, useEffect } from "react";
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
} from "@zeit-ui/react";
import { Copy, Edit2, Delete, ArrowRight } from "@zeit-ui/react-icons";
import ContentLoader from "react-content-loader";
import { Line, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Head from "next/head";

const LinkSummary = ({ selectedLink, deleteLink, updateLink }) => {
	const router = useRouter();

	const { palette } = useTheme();

	const [customUrl, setCustomUrl] = useState("");

	const [deleteModal, setDeleteModal] = useState(false);

	const [editEnabled, setEditEnabled] = useState(false);
	const [isLoading_CustomUrl, setIsLoading_CustomUrl] = useState(false);
	const [customUrlAvailable, setCustomUrlAvailable] = useState(true);
	const [session] = useSession();
	const { copy } = useClipboard();
	const [, setToast] = useToasts();

	const [countryList, setCountryList] = useState([]);
	const [refererList, setRefererList] = useState([]);
	const [timelineList, setTimelineList] = useState([]);
	const [visitorsData, setVisitorsData] = useState([]);
	const [referersData, setReferersData] = useState([]);
	const [timelineData, setTimelineData] = useState([]);

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
		if (customUrl.length <= 0) {
			setToast({ text: "Custom Url can't be empty." });
			return;
		}

		try {
			setIsLoading_CustomUrl(true);
			const res = await fetch("/api/url", {
				credentials: "include",
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					urlCode: selectedLink.urlCode,
					newUrlCode: customUrl,
				}),
			});
			const data = await res.json();
			if (data.code === "CUSTOM_CODE_NOT_AVAILABLE") {
				setCustomUrlAvailable(false);
				return;
			}
			if (res.ok) {
				updateLink(selectedLink.urlCode, customUrl);
				setCustomUrlAvailable(true);
				setToast({ text: "Updated link Url" });
				setEditEnabled(false);
				router.push(`/dashboard/${customUrl}`, undefined, { shallow: true });
			}
			setIsLoading_CustomUrl(true);
		} catch (error) {
			setToast({ text: "Some Error Occured" });
			setIsLoading_CustomUrl(false);
		}
	};

	const deleteShortUrl = () => {
		fetch("/api/url", {
			credentials: "include",
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ urlCode: selectedLink.urlCode }),
		})
			.then(() => {
				setDeleteModal(false);
				setToast({ text: "Deleted" });
				deleteLink(selectedLink.urlCode);
				if (session) {
					router.replace("/dashboard");
				} else {
					router.replace("/");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const copyLink = (link) => {
		copy(link);
		setToast({ text: "Link Copied" });
	};

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

	const timelineChartData = {
		labels: timelineList,
		datasets: [
			{
				lineTension: 0,
				backgroundColor: palette.violetLighter,
				borderColor: palette.violet,
				borderWidth: 2,
				borderJoinStyle: "round",
				pointRadius: 5,
				pointBorderColor: palette.background,
				pointBackgroundColor: palette.violetDark,
				pointBorderWidth: 3,
				data: timelineData,
			},
		],
	};

	const timelineChartOptions = {
		scales: {
			yAxes: [
				{
					ticks: { beginAtZero: true, display: false },
				},
			],
		},
		legend: { display: false },
		title: {
			display: true,
			text: "Visits",
			padding: 10,
			lineHeight: 4,
			fontSize: 18,
			fontColor: palette.accents_4,
		},
	};

	Array.prototype.shuffle = function (n) {
		return this.sort(() => n - Math.random());
	};
	const countriesChartData = {
		labels: countryList,
		datasets: [
			{
				backgroundColor: colorsList.shuffle(0.5),
				data: visitorsData,
			},
		],
	};

	const countriesChartOptions = {
		scales: {
			yAxes: [
				{
					ticks: { beginAtZero: true, display: false },
				},
			],
		},
		legend: { display: false },
		title: {
			display: true,
			text: "Countries",
			padding: 10,
			lineHeight: 4,
			fontSize: 18,
			fontColor: palette.accents_4,
		},
	};

	const referersChartData = {
		labels: refererList,
		datasets: [
			{
				backgroundColor: colorsList2.shuffle(0.5),
				data: referersData,
			},
		],
	};

	const referersChartOptions = {
		scales: {
			yAxes: [
				{
					ticks: { beginAtZero: true, display: false },
				},
			],
		},
		legend: { display: false },
		title: {
			display: true,
			text: "Referers",
			padding: 10,
			lineHeight: 4,
			fontSize: 18,
			fontColor: palette.accents_4,
		},
	};

	const editInputKeyUp = (e) => {
		if (e.target.value.length > 0 && e.keyCode === 13) {
			updateCustomUrl();
		}
	};

	return (
		<div>
			<div className="linkSummary">
				{!selectedLink ? (
					<ContentLoader
						uniqueKey="nikketan"
						width={228}
						height={68}
						viewBox="0 0 228 68"
					>
						<rect x="0" y="0" rx="5" ry="5" width="228" height="10" />
						<rect x="0" y="20" rx="8" ry="8" width="144" height="16" />
						<rect x="0" y="46" rx="5" ry="5" width="164" height="10" />
					</ContentLoader>
				) : (
					<>
						<Head>
							<title>
								{selectedLink.title ? `Shortr - ${selectedLink.title}` : "Shortr"}
							</title>
						</Head>
						<Text small type="secondary">
							Created on {new Date(selectedLink.dateCreated).toString().substr(0, 24)}
						</Text>

						<Text style={{ margin: 0 }} h3>
							{selectedLink.title || selectedLink.longUrl}
						</Text>

						<Text small type="secondary">
							<a href={selectedLink.longUrl}>{selectedLink.longUrl}</a>
						</Text>
					</>
				)}

				<div className="link">
					<Text className="shortUrl" type="success">
						{!selectedLink && (
							<ContentLoader
								uniqueKey="nikketan"
								width={228}
								height={10}
								viewBox="0 0 228 10"
							>
								<rect x="0" y="0" rx="5" ry="5" width="228" height="10" />
							</ContentLoader>
						)}
						{selectedLink && (
							<a href={selectedLink.shortUrl}>{selectedLink.shortUrl}</a>
						)}
					</Text>
					<div className="linkActions">
						<Button
							auto
							className="linkButton"
							size="small"
							onClick={() => copyLink(selectedLink.shortUrl)}
							icon={<Copy />}
						>
							Copy
						</Button>
						<Button
							auto
							className="linkButton"
							size="small"
							icon={<Edit2 />}
							onClick={() => setEditEnabled(!editEnabled)}
						>
							Edit
						</Button>
						<Button
							auto
							className="linkButton"
							size="small"
							type="error-light"
							icon={<Delete />}
							onClick={() => setDeleteModal(true)}
						>
							Delete
						</Button>
					</div>
				</div>
				<Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
					<Modal.Title>Delete</Modal.Title>
					<Modal.Subtitle>Are you sure ?</Modal.Subtitle>
					<Modal.Content>
						<Text p>
							This can&apos;t be undone. The Short url will no longer redirect you to
							your URL.{" "}
						</Text>
					</Modal.Content>
					<Modal.Action passive onClick={() => setDeleteModal(false)}>
						Cancel
					</Modal.Action>
					<Modal.Action onClick={deleteShortUrl}>Delete</Modal.Action>
				</Modal>
				{editEnabled && (
					<div className="editLink">
						<Input
							label="https://short.tr/"
							placeholder={selectedLink.urlCode}
							value={customUrl}
							className="editInput"
							onKeyUp={editInputKeyUp}
							onChange={(e) => setCustomUrl(e.target.value)}
						>
							{!customUrlAvailable && (
								<Dot type="error">
									Custom URL already taken, try a different one
								</Dot>
							)}
						</Input>
						<Button
							style={{ margin: "0 10px" }}
							size="small"
							className="editButton"
							loading={isLoading_CustomUrl}
							iconRight={<ArrowRight />}
							onClick={updateCustomUrl}
						>
							Submit
						</Button>
					</div>
				)}

				<Divider />
				{!selectedLink ? (
					<div>
						<ContentLoader
							uniqueKey="loader_visits"
							width={112}
							height={10}
							viewBox="0 0 112 10"
						>
							<rect x="0" y="0" rx="5" ry="5" width="112" height="10" />
						</ContentLoader>
						<ContentLoader
							uniqueKey="loader_charts"
							width="100%"
							height={600}
							viewBox="0 0 600 600"
						>
							<rect x="0" y="50" rx="5" ry="5" width="100%" height="250" />
							<rect x="0" y="350" rx="5" ry="5" width="100%" height="250" />
						</ContentLoader>
					</div>
				) : (
					<div>
						<Text type="secondary" small style={{ letterSpacing: 1 }}>
							Total Visits : <b>{selectedLink.visits}</b>
						</Text>

						<Line
							data={timelineChartData}
							width={100}
							height={50}
							options={timelineChartOptions}
						/>
						<Doughnut data={countriesChartData} options={countriesChartOptions} />
						<Doughnut data={referersChartData} options={referersChartOptions} />
					</div>
				)}
			</div>
			<style jsx>
				{`
					.linkSummary {
						margin: 10px 25px;
					}

					a {
						color: inherit;
						text-decoration: none;
					}

					.link {
						display: flex;
						flex-wrap: wrap;
						flex-direction: column;
						justify-content: space-between;
					}
					.linkActions {
						display: flex;
						justify-content: space-between;
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

					@media only screen and (min-width: 652px) {
						.link {
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: space-between;
						}
						.linkActions {
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 280px;
						}
						.editLink {
							display: flex;
							margin-top: 10px;
							height: 60px;
							flex-direction: row;
							width: 100%;
							align-items: flex-end;
							justify-content: flex-start;
						}
					}
				`}
			</style>
		</div>
	);
};

export default LinkSummary;

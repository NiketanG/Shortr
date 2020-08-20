import { useState } from "react";
import Link from "next/link";
import {
	Modal,
	Dot,
	Text,
	Input,
	useToasts,
	useTheme,
	Loading,
	Row,
} from "@zeit-ui/react";
import { Link2 } from "@zeit-ui/react-icons";
import PropTypes from "prop-types";

const newUrlModal = ({ show, setShowCreateModal, addUrl }) => {
	const { palette } = useTheme();

	const [, setToast] = useToasts();

	const [customUrl, setCustomUrl] = useState("");
	const [customURLAvailable, setCustomURLAvailable] = useState(true);
	const [urlToShorten, setUrlToShorten] = useState("");
	const [shortened, setShortened] = useState(false);
	const [linkId, setLinkId] = useState("");
	const [loadingShortening, setLoadingShortening] = useState(false);

	const shorten = () => {
		setLoadingShortening(true);
		let longUrl = urlToShorten;
		if (
			!(
				urlToShorten.includes("http://") ||
				urlToShorten.includes("https://")
			)
		) {
			longUrl = `http://${urlToShorten}`;
		}
		const data = { longUrl };
		if (customUrl.length !== 0) {
			data.customCode = customUrl;
		}

		fetch("/api/url", {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.ok) {
					response.json().then((resData) => {
						addUrl(resData);
						setCustomURLAvailable(true);
						setLinkId(resData.urlCode);
						setShortened(true);
						setToast({ text: "Shortened" });
					});
				} else {
					if (response.status === 401) {
						setToast({
							text: "You don't have permission to edit that URL",
						});
					}
					response.json().then((resData) => {
						if (resData.code === "CUSTOM_CODE_NOT_AVAILABLE") {
							setCustomURLAvailable(false);
						}
					});
				}
			})
			.catch((err) => {
				setToast({ text: "Some error occured" });
			})
			.finally(() => {
				setLoadingShortening(false);
			});
	};

	const modalClose = () => {
		setShowCreateModal(false);
		setCustomUrl("");
		setUrlToShorten("");
		setShortened(false);
		setLinkId("");
		setCustomURLAvailable(true);
	};

	return (
		<Modal open={show} onClose={modalClose}>
			<Modal.Title>Create a Shortr Url</Modal.Title>
			<Modal.Subtitle>Enter Long Url below</Modal.Subtitle>
			<Modal.Content>
				<Input
					label="http://"
					iconRight={<Link2 />}
					placeholder="URL"
					value={urlToShorten}
					onChange={(e) => setUrlToShorten(e.target.value)}
					style={{ width: "100%" }}
				/>
				<div className="newCustomURL">
					<Text p style={{ margin: "10px 0 5px 0" }}>
						Enter a custom Short URL (optional)
					</Text>
					<Input
						placeholder="Custom Short Url"
						style={{ width: "100%" }}
						value={customUrl}
						onChange={(e) => setCustomUrl(e.target.value)}
					>
						{!customURLAvailable && (
							<Dot type="error">
								Custom URL not available. Try a different one
							</Dot>
						)}
					</Input>
					{loadingShortening && (
						<Row style={{ margin: "25px 0 5px 0" }}>
							<Loading size="large">Shortening</Loading>
						</Row>
					)}
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
			</Modal.Content>
			<Modal.Action passive onClick={modalClose}>
				Cancel
			</Modal.Action>
			{shortened ? (
				<Modal.Action onClick={modalClose}>Done</Modal.Action>
			) : (
				<Modal.Action onClick={shorten}>Submit</Modal.Action>
			)}
		</Modal>
	);
};

newUrlModal.propTypes = {
	show: PropTypes.bool.isRequired,
	setShowCreateModal: PropTypes.func.isRequired,
	addUrl: PropTypes.func.isRequired,
};

export default newUrlModal;

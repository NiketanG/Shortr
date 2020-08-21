import { Text, useTheme } from "@zeit-ui/react";
import { Users } from "@zeit-ui/react-icons";
import PropTypes from "prop-types";
import useWindowSize from "../utils/useWindowSize";
import Link from "next/link";

const LinkItem = ({ date, title, shortUrl, visits, urlCode, selectLink }) => {
	const { palette } = useTheme();
	const { width } = useWindowSize();

	if (width <= 652) {
		return (
			<div>
				<Link href={`/dashboard/${urlCode}`}>
					<a style={{ color: "inherit" }}>
						<div
							role="button"
							tabIndex="0"
							className="link"
							key={urlCode}
							onClick={() => selectLink(urlCode)}
						>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<Text size={14} small>
									{date}
								</Text>
								<div className="visits">
									<Users size={14} />
									<Text style={{ margin: "0 5px" }} size={14} small>
										{visits}
									</Text>
								</div>
							</div>
							<div className="urlTitle">
								<Text style={{ margin: 0 }} size={20}>
									{title}
								</Text>
							</div>
							<div className="shortUrl">
								<Text size={14} type="success" small>
									{shortUrl}
								</Text>
							</div>
						</div>
					</a>
				</Link>
				<style jsx>
					{`
						.link {
							padding: 20px;
							transition: 0.2s ease-in-out;
						}
						.link:hover {
							background-color: ${palette.accents_1};
							box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
						}
						.urlTitle {
							width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.shortUrl {
							width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					`}
				</style>
			</div>
		);
	}
	return (
		<div>
			<div
				role="button"
				tabIndex="0"
				className="link"
				key={urlCode}
				onClick={() => selectLink(urlCode)}
			>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<Text size={14} small>
						{date}
					</Text>
					<div className="visits">
						<Users size={14} />
						<Text style={{ margin: "0 5px" }} size={14} small>
							{visits}
						</Text>
					</div>
				</div>
				<div className="urlTitle">
					<Text style={{ margin: 0 }} size={20}>
						{title}
					</Text>
				</div>
				<div className="shortUrl">
					<Text size={14} type="success" small>
						<a href={shortUrl}>{shortUrl}</a>
					</Text>
				</div>
			</div>
			<style jsx>
				{`
					.link {
						padding: 20px;
						transition: 0.2s ease-in-out;
					}
					.link:hover {
						background-color: ${palette.accents_1};
						box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
					}
					.urlTitle {
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.shortUrl {
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				`}
			</style>
		</div>
	);
};

LinkItem.propTypes = {
	date: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	shortUrl: PropTypes.string.isRequired,
	visits: PropTypes.number.isRequired,
	urlCode: PropTypes.string.isRequired,
	selectLink: PropTypes.func.isRequired,
};

export default LinkItem;

import { Text, useTheme } from "@geist-ui/core";
import { Users } from "@geist-ui/icons";
import Link from "next/link";
import { URLItem } from "../../models/Url";

type LinkItemProps = {
	item: URLItem;
};
const LinkItem: React.FC<LinkItemProps> = ({
	item: { dateCreated: date, title, shortUrl, visits, urlCode, _id },
}) => {
	const { palette } = useTheme();

	return (
		<div className="link">
			<Link href={`/dashboard/${_id}`} style={{ color: "inherit" }}>
				<div role="button" tabIndex={0} key={urlCode}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Text small font={0.8} mb={0}>
							{new Date(date).toString().substr(0, 24)}
						</Text>
						<div className="visits">
							<Users size={14} />
							<Text
								style={{ margin: "0 5px" }}
								font={0.8}
								mb={0}
								small
							>
								{visits}
							</Text>
						</div>
					</div>
					<div className="urlTitle">
						<Text style={{ margin: 0 }}>{title}</Text>
					</div>
					<div className="shortUrl">
						<Text type="success" small>
							{shortUrl}
						</Text>
					</div>
				</div>
			</Link>
			<style jsx>
				{`
					.visits {
						display: flex;
						align-items: center;
					}
					.link {
						border-bottom: 1px solid ${palette.accents_2};
						padding: 16px 20px 16px 20px;
						transition: 0.2s ease-in-out;
					}
					.link:hover {
						background-color: ${palette.accents_1};
						box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
							0 3px 6px rgba(0, 0, 0, 0.23);
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

export default LinkItem;

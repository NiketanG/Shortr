import { useState, useEffect } from "react";
import { Text, Button, Input, Divider, useMediaQuery } from "@zeit-ui/react";
import { Plus, Search } from "@zeit-ui/react-icons";
import ContentLoader from "react-content-loader";
import PropTypes from "prop-types";
import LinkItem from "./LinkItem";
import CreateUrlModal from "./CreateUrlModal";
import useWindowSize from "../utils/useWindowSize";

const LinksLoader = ({ uniqueKey }) => (
	<div>
		<ContentLoader
			uniqueKey={uniqueKey}
			style={{ margin: "15px 0px 15px 20px" }}
			width={200}
			height={68}
			viewBox="0 0 200 68"
		>
			<rect x="0" y="5" rx="5" ry="5" width="144" height="10" />
			<rect x="0" y="25" rx="8" ry="8" width="112" height="16" />
			<rect x="0" y="52" rx="5" ry="5" width="128" height="10" />
		</ContentLoader>
		<Divider y={0} />
	</div>
);

LinksLoader.propTypes = {
	uniqueKey: PropTypes.string.isRequired,
};

const Links = ({ selectLink, links, addNewUrl }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const [searchResults, setSearchResults] = useState([]);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const [linkData, setLinkData] = useState(null);

	useEffect(() => {
		if (links) {
			setLinkData(links);
		}
	}, [links]);

	const chooseLink = (selection) => {
		selectLink(selection);
	};

	const searchFor = (val) => {
		setSearchTerm(val);
		setSearchResults(
			linkData.filter((res) => {
				return res.longUrl.includes(val) || res.urlCode.includes(val);
			})
		);
		if (val === "") {
			setSearchResults([]);
		}
	};

	return (
		<div className="container">
			<div style={{ padding: "10px 20px", width: "100%" }}>
				<Button
					style={{
						flexShrink: 0,
						width: "100%",
					}}
					type="success"
					shadow
					icon={<Plus />}
					onClick={() => setShowCreateModal(true)}
				>
					Create
				</Button>

				<Text size={14} style={{ letterSpacing: 3, marginTop: "25px" }} type="secondary">
					LINKS
				</Text>
				<Input
					placeholder="Search"
					value={searchTerm}
					onChange={(e) => searchFor(e.target.value)}
					icon={<Search />}
					size="large"
					width="100%"
				/>
			</div>
			<CreateUrlModal
				setShowCreateModal={setShowCreateModal}
				show={showCreateModal}
				addUrl={addNewUrl}
			/>

			<div className="links">
				{!linkData && (
					<div>
						<LinksLoader uniqueKey="link_loader1" />
						<LinksLoader uniqueKey="link_loader2" />
						<LinksLoader uniqueKey="link_loader3" />
						<LinksLoader uniqueKey="link_loader4" />
					</div>
				)}
				<div>
					{searchTerm.length === 0 ? (
						linkData &&
						linkData.map((link) => (
							<div key={link.urlCode}>
								<LinkItem
									date={new Date(link.dateCreated).toString().substr(0, 24)}
									visits={link.visits}
									title={link.title || link.longUrl}
									shortUrl={link.shortUrl}
									urlCode={link.urlCode}
									selectLink={chooseLink}
								/>
								<Divider y={0} />
							</div>
						))
					) : searchResults.length > 0 ? (
						searchResults.map((link) => (
							<div key={link.urlCode}>
								<LinkItem
									date={new Date(link.dateCreated).toString().substr(0, 24)}
									visits={link.visits}
									title={link.title || link.longUrl}
									shortUrl={link.shortUrl}
									urlCode={link.urlCode}
									selectLink={chooseLink}
								/>
								<Divider y={0} />
							</div>
						))
					) : (
						<Text type="secondary" style={{ textAlign: "center" }}>
							No results found for "{searchTerm}"
						</Text>
					)}
				</div>
			</div>
			<style jsx>
				{`
					.container {
						height: calc(100vh - 110px);
						display: flex;
						flex-direction: column;
						width: 100vw;
						align-items: center;
					}

					@media screen and (min-width: 652px) {
						.container {
							width: 300px;
							border-right: 1px solid rgba(0, 0, 0, 0.2);
						}
					}
					.links {
						margin: 10px 0;
						width: 100%;
						align-self: flex-start;
						overflow-y: auto;
					}
				`}
			</style>
		</div>
	);
};

Links.propTypes = {
	selectLink: PropTypes.func.isRequired,
	links: PropTypes.array,
	addNewUrl: PropTypes.func.isRequired,
};
Links.defaultProps = {
	links: undefined,
};
export default Links;

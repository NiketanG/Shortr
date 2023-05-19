/* eslint-disable react/no-unescaped-entities */
import { Button, Divider, Input, Text, useTheme } from "@geist-ui/core";
import { Plus, Search } from "@geist-ui/icons";
import { useMemo } from "react";
import { useState } from "react";
import ContentLoader from "react-content-loader";
import { URLItem } from "../../models/Url";
import CreateUrlModal from "../CreateUrlModal";
import LinkItem from "../LinkItem";
import axios from "axios";
import useSWR from "swr";

const LinksLoader = ({ uniqueKey }: { uniqueKey: string }) => (
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
		<Divider />
	</div>
);

const getUrls = async (): Promise<Array<URLItem>> => {
	const res = await axios.get("/api/url");
	return res.data;
};

const Links = () => {
	const { data: urls, isLoading, mutate } = useSWR("/api/url", getUrls);

	const { palette } = useTheme();
	const [searchTerm, setSearchTerm] = useState("");

	const results = useMemo(() => {
		if (!urls) return [];
		if (searchTerm.length === 0) return urls;
		return urls?.filter((res) => {
			return (
				res.longUrl.includes(searchTerm) ||
				res.urlCode.includes(searchTerm) ||
				res.title?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
	}, [urls, searchTerm]);

	const [showCreateModal, setShowCreateModal] = useState(false);

	const onAddUrl = (url: URLItem) => {
		const tempUrls = urls || [];
		mutate([...tempUrls, url]);
	};
	return (
		<div className="container">
			<div className="header">
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

				<Text style={{ letterSpacing: 3 }} type="secondary">
					LINKS
				</Text>
				<Input
					placeholder="Search"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					icon={<Search />}
					width="100%"
				/>
			</div>
			<CreateUrlModal
				setShowCreateModal={setShowCreateModal}
				show={showCreateModal}
				addUrl={onAddUrl}
			/>

			<div className="links">
				{isLoading ? (
					<div>
						<LinksLoader uniqueKey="link_loader1" />
						<LinksLoader uniqueKey="link_loader2" />
						<LinksLoader uniqueKey="link_loader3" />
						<LinksLoader uniqueKey="link_loader4" />
					</div>
				) : (
					<div
						style={{
							marginTop: 6,
						}}
					>
						{results.length === 0 ? (
							searchTerm.length !== 0 ? (
								<Text
									type="secondary"
									style={{ textAlign: "center" }}
								>
									No results found for "{searchTerm}"
								</Text>
							) : (
								<Text
									type="secondary"
									style={{ textAlign: "center" }}
								>
									No links created yet.
								</Text>
							)
						) : (
							results.map((link) => (
								<LinkItem item={link} key={link.urlCode} />
							))
						)}
					</div>
				)}
			</div>
			<style jsx>
				{`
					.container {
						height: calc(100vh - 86px);
						display: flex;
						width: 100%;
						flex-direction: column;
						align-items: center;
					}
					.header {
						padding: 10px 0px 0px 0px;
						width: calc(100% - 20px);
					}

					@media screen and (min-width: 652px) {
						.container {
							border-right: 1px solid ${palette.accents_2};
						}
					}
					.links {
						width: 100%;
						align-self: flex-start;
						overflow-y: auto;
					}
				`}
			</style>
		</div>
	);
};

export default Links;

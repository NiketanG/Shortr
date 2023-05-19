import Head from "next/head";
import React from "react";
import Navbar from "../Navbar";

import { Grid } from "@geist-ui/core";
import LinksList from "../LinksList";

type DashboardProps = {
	children: React.ReactNode;
	hideLeftPanel?: boolean;
};
const DashboardLayout: React.FC<DashboardProps> = ({
	children,
	hideLeftPanel,
}) => {
	return (
		<div>
			<Head>
				<title>Shortr - Dashboard</title>
			</Head>

			<main>
				<Navbar />
				<div className="panel">
					<Grid.Container>
						{hideLeftPanel ? null : (
							<Grid xs={24} sm={24} md={8} lg={7}>
								<LinksList />
							</Grid>
						)}
						<Grid xs={24} sm={24} md={16} lg={17}>
							<div className="sidePanel">{children}</div>
						</Grid>
					</Grid.Container>
				</div>
			</main>
			<style jsx>{`
				.panel {
					margin-top: 86px;
					height: calc(100vh - 86px);
				}

				@media (min-width: 1024px) {
					.panel {
						max-width: 1024px;
						margin: 86px auto 0 auto;
					}
				}

				@media (min-width: 1200px) {
					.panel {
						max-width: 1200px;
						margin: 86px auto 0 auto;
					}
				}

				.sidePanel {
					display: flex;
					width: 100%;
					padding: 0px 0px 0px 20px;
				}
			`}</style>
		</div>
	);
};

export default DashboardLayout;

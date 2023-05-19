import { Text } from "@geist-ui/core";
import DashboardLayout from "../../components/DashboardLayout";

const Dashboard = () => {
	return (
		<DashboardLayout>
			<div className="defaultSidePanel">
				<Text h4 type="secondary">
					Select a link from the list to view stats
				</Text>
			</div>
			<style jsx>{`
				.defaultSidePanel {
					display: none;
				}

				@media (min-width: 768px) {
					.defaultSidePanel {
						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						flex-direction: column;
						align-items: center;
					}
				}
			`}</style>
		</DashboardLayout>
	);
};

export default Dashboard;

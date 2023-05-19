import { useRouter } from "next/router";
import DashboardLayout from "../../components/DashboardLayout";
import LinkSummary from "../../components/LinkSummary";
import useWindowSize from "../../utils/useWindowSize";

const LinkDetails = () => {
	const router = useRouter();
	const slug = router?.query?.slug;

	const { width } = useWindowSize();

	return (
		<DashboardLayout hideLeftPanel={width < 768}>
			{typeof slug === "string" ? <LinkSummary slug={slug} /> : null}
		</DashboardLayout>
	);
};

export default LinkDetails;

import React from "react";
import {
	useTheme,
	Text,
	User,
	Tooltip,
	Button,
	Popover,
	Toggle,
	useMediaQuery,
} from "@zeit-ui/react";
import { useSession, signout } from "next-auth/client";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { Sun, Moon, LogOut } from "@zeit-ui/react-icons";

const Navbar = ({ toggleTheme }) => {
	const isXS = useMediaQuery("xs", { match: "down" });
	const { palette } = useTheme();
	const [session, loading] = useSession();

	const { type } = useTheme();

	return (
		<div>
			<div className="navbar">
				<div className="title">
					<h3 className="titleText">
						<Link href="/">
							<a>Shortr</a>
						</Link>
					</h3>
				</div>
				{session && (
					<div className="user">
						<Popover
							content={
								<div style={{ padding: 10 }}>
									{session.user.name}
									<br />
									{session.user.email}
								</div>
							}
						>
							<User src={session.user.image} name={!isXS ? session.user.name : null}>
								{!isXS ? session.user.email : null}
							</User>
						</Popover>
						<Tooltip placement="bottomEnd" text="Logout">
							<Button
								size="mini"
								auto
								icon={<LogOut />}
								onClick={() => signout({ callbackUrl: "/" })}
							/>
						</Tooltip>
					</div>
				)}

				{loading && (
					<div>
						<ContentLoader
							uniqueKey="nikketan"
							width={201}
							height={36}
							viewBox="0 0 201 36"
						>
							<circle cx="18" cy="18" r="18" />
							<rect x="45" y="5" rx="6" ry="6" width="156" height="10" />
							<rect x="45" y="20" rx="4" ry="4" width="112" height="8" />
						</ContentLoader>
					</div>
				)}
				<div className="theme">
					<Sun size={18} />
					<Toggle
						onChange={toggleTheme}
						style={{ margin: "0 5px" }}
						checked={type === "dark"}
					/>
					<Moon size={18} />
				</div>
			</div>
			<style jsx>
				{`
					.navbar {
						display: flex;
						flex-direction: row;
						align-items: center;
						position: fixed;
						top: 0;
						background-color: ${palette.background};
						width: 100%;
						z-index: 100;
						box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
					}
					a {
						color: inherit;
						text-decoration: none;
					}
					.title {
						padding: 10px 50px;

						flex-grow: 1;
					}
					.titleText {
						font-size: 30px;
					}
					@media screen and (max-width: 600px) {
						.title {
							padding: 20px 30px;
						}
						.theme {
							margin: 00px;
						}
					}

					.theme {
						margin: 10px;
					}
					.user {
						display: flex;
						align-items: center;
					}

					@media screen and (min-width: 962px) {
						.navbar {
							padding: 0 20%;
						}
					}
				`}
			</style>
		</div>
	);
};

export default Navbar;

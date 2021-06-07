import React from "react";
import { useTheme, User, Tooltip, Button, Popover, Toggle } from "@zeit-ui/react";
import { useSession, signout } from "next-auth/client";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { Sun, Moon, LogOut } from "@zeit-ui/react-icons";
import useWindowSize from "../utils/useWindowSize";

const Navbar = ({ toggleTheme }) => {
	const { width } = useWindowSize();
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
				<div className="navbarRight">
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
								<User
									src={session.user.image}
									name={width > 652 ? session.user.name : null}
								>
									{width > 652 ? session.user.email : null}
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
						justify-content: space-between;
					}
					.navbarRight {
						display: flex;
						align-items: center;
					}
					a {
						color: inherit;
						text-decoration: none;
					}
					.title {
						padding: 10px 20px;
					}
					.titleText {
						font-size: 30px;
					}
					@media screen and (max-width: 600px) {
						.title {
							padding: 20px px;
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
							justify-content: space-around;
						}
					}
				`}
			</style>
		</div>
	);
};

export default Navbar;

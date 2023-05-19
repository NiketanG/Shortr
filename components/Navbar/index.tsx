import React, { FC } from "react";
import {
	useTheme,
	User,
	Tooltip,
	Button,
	Popover,
	Toggle,
} from "@geist-ui/core";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { Sun, Moon, LogOut } from "@geist-ui/icons";
import { useSession, signOut } from "next-auth/react";
import useWindowSize from "../../utils/useWindowSize";
import { useAppStore } from "../../store";
import { Session } from "next-auth";

const UserPopover: FC<Pick<Session, "user">> = ({ user }) => (
	<User src={user?.image || undefined} name={user?.name}>
		{user?.email}
	</User>
);
const Navbar = () => {
	const { palette } = useTheme();
	const { data: session, status } = useSession();

	const toggleTheme = useAppStore((state) => state.toggleTheme);

	const { type } = useTheme();

	return (
		<div>
			<div className="navbar">
				<div className="title">
					<h3 className="titleText">
						<Link href="/">Shortr</Link>
					</h3>
				</div>
				<div className="navbarRight">
					{session && (
						<div className="user">
							<Popover
								content={
									(<UserPopover user={session.user} />) as any
								}
							>
								<User
									src={session.user?.image || undefined}
									name={session.user?.name}
								>
									{session.user?.email}
								</User>
							</Popover>
							<Tooltip placement="bottomEnd" text="Logout">
								<Button
									auto
									icon={<LogOut />}
									onClick={() =>
										signOut({ callbackUrl: "/" })
									}
								/>
							</Tooltip>
						</div>
					)}

					{status === "loading" && (
						<div>
							<ContentLoader
								uniqueKey="nikketan"
								width={201}
								height={36}
								viewBox="0 0 201 36"
							>
								<circle cx="18" cy="18" r="18" />
								<rect
									x="45"
									y="5"
									rx="6"
									ry="6"
									width="156"
									height="10"
								/>
								<rect
									x="45"
									y="20"
									rx="4"
									ry="4"
									width="112"
									height="8"
								/>
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
						box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
							0 3px 6px rgba(0, 0, 0, 0.23);
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
							margin: 0px;
						}
					}

					.theme {
						margin: 10px;
						display: flex;
						align-items: center;
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

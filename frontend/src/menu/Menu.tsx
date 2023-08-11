import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import ChannelNew from "../channel/ChannelNew";
import MyChannelList from "./MyChannelList";
import instance from "../refreshToken";
import MyDmList from "./MyDmList";
import "./Menu.css";
import { error } from "console";

type MenuProps = {
	showBackButton: boolean;
	channelName: string;
	channelIdx: number;
};

interface GameApplyProps {
	playerNickName: string;
	mode: number;
	handleAcceptButton: () => void;
	handleRefuseButton: () => void;
}

const Menu = ({ showBackButton, channelName, channelIdx }: MenuProps) => {
	interface Channel {
		chIdx: number;
		chName: string;
		chPwd: number | null;
		chUserCnt: number;
		isDM: boolean;
		operatorId: string;
	}

	interface PrivateChannel {
		chIdx: number;
		chName: string;
		chPwd: number | null;
		chUserCnt: number;
		isDM: boolean;
		operatorId: string;
	}

	interface Dm {
		chIdx: number;
		chName: string;
		chPwd: number | null;
		chUserCnt: number;
		isDM: boolean;
		operatorId: string;
	}

	// const Menu = ({ showBackButton}: MenuProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
	const [intraId, setIntraId] = useState("");
	const [nickName, setNickName] = useState("");
	const [chName, setChName] = useState(channelName);
	const [chIdx, setChIdx] = useState(0);
	const [playerNickName, setPlayerNickName] = useState("");
	const [mode, setMode] = useState(0);
	const [showWaiting, setShowWaiting] = useState(false);
	const [showCancel, setShowCancel] = useState(false);
	const [isGameApply, setisGameApply] = useState(false);
	const [showDropDownBox, setShowDropDownBox] = useState(false); // 추가된 상태 값
	const [showNewChat, setShowNewChat] = useState(false);
	const navigate = useNavigate();
	const [channels, setChannels] = useState<Channel[]>([]);
	const [privateChannels, setPrivateChannels] = useState<PrivateChannel[]>(
		[]
	);
	const [showSetting, setShowSetting] = useState(true);
	const [dms, setDms] = useState<Dm[]>([]);
	const location = useLocation();
	const state = location.state as { chIdx: number };
	const handleRefuseButton = () => {
		socket.emit("game-reject", {
			intraId: intraId,
			nickName: nickName,
			player1: playerNickName,
			mode: mode,
		});
		setisGameApply(false);
	};
	const handleAcceptButton = () => {
		socket.emit("game-accept", {
			intraId: intraId,
			nickName: nickName,
			player1: playerNickName,
			mode: mode,
		});
		setisGameApply(false);
	};
	if (state && state.chIdx) {
		instance
			.get(`http://localhost:5001/channel/name/${state.chIdx}`)
			.then(async (response) => {
				// 요청이 성공하면 데이터를 상태로 설정
				if (response.data.chName[0] === "#" && intraId) {
					setShowSetting(false);
					let name: string = await ChannelName(
						response.data.chName
							.replace(/#/g, "")
							.replace(intraId, "")
					);
					setChName(name);
				} else {
					setChName(response.data.chName);
				}
				setChIdx(state.chIdx);
			})
			.catch((error) => {
				// 요청이 실패하면 에러 처리
				console.error("API 요청 실패:", error);
			});
	}

	function getChannel() {
		instance
			.get("http://localhost:5001/channel/my/all")
			.then((response) => {
				// console.log(response.data);
				setChannels(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getPrivateChannel() {
		instance
			.get("http://localhost:5001/channel/my/private")
			.then((response) => {
				// console.log(response.data);
				setPrivateChannels(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getDm() {
		return instance
			.get("http://localhost:5001/channel/my/dm") // Return the promise here
			.then((response) => {
				return response; // Return the response
			})
			.catch((error) => {
				console.log(error);
				throw error; // Re-throw the error to handle it later if needed
			});
	}

	const handleStartClick = () => {
		setShowWaiting(true);
		socket.emit("game-queue-join", {
			intraId: intraId,
			nickName: nickName,
		});
		setShowCancel(true);
	};

	const handleCancelClick = () => {
		setShowWaiting(false);
		socket.emit("game-queue-exit", {
			intraId: intraId,
			nickName: nickName,
		});
		setShowCancel(false);
	};

	const ChannelName = async (chName: string) => {
		try {
			const response = await instance.get(
				`http://localhost:5001/member/${chName}`
			);

			return response.data.nickName;
		} catch (error) {
			console.log(error);
			return "";
		}
	};

	const handleDropDownBoxToggle = async () => {
		setIsExpanded(!isExpanded);
		if (!isExpanded) {
			getChannel();
			getPrivateChannel();
			try {
				const response = await getDm();
				const modifiedDms = await Promise.all(
					response.data.map(async (dm: Dm) => ({
						...dm,
						chName: await ChannelName(
							dm.chName.replace(/#/g, "").replace(intraId, "")
						),
					}))
				);
				setDms(modifiedDms);
			} catch (error) {
				console.log(error);
			}
		}
		setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
		setShowDropDownBox(!showDropDownBox);
	};

	const handleMakeNew = () => {
		setShowNewChat(!showNewChat);
	};

	const handleSettingButton = () => {
		instance
			.post(`http://localhost:5001/channel/author/${channelIdx}`)
			.then((response) => {
				// console.log(response.data)
				if (response.data !== true) {
					alert("관리자만 접속할 수 있습니다!");
					navigate("/chat", {
						state: {
							channelName: chName,
							chIdx: chIdx,
						},
					});
				} else {
					navigate("/admin", {
						state: {
							channelName: chName,
							chIdx: chIdx,
						},
					});
				}
			})
			.catch((error) => {
				console.error("API 요청 실패:", error);
			});
	};

	useEffect(() => {
		socket.on("game-ready", (data) => {
			const { player1, player2, roomName, mode } = data;
			console.log(data);
			navigate("/game", { state: { player1, player2, roomName, mode } });
		});

		socket.on("game-apply", (data) => {
			setPlayerNickName(data.nickName);
			setMode(data.mode);
			setisGameApply(true);
		});

		instance
			.get("http://localhost:5001/auth/me")
			.then((response) => {
				setIntraId(response.data.intraId);
				setNickName(response.data.nickName);
			})
			.catch((error) => {
				console.log(error);
			});
		return () => {
			socket.off("game-apply");
			socket.off("game-ready");
		};
	}, []);

	const handleIntoHome = () => {
		setShowDropDownBox(false); // 드롭다운 박스가 사라지도록 상태 변경
		navigate("/main");
	};

	return (
		<div className="menu-box">
			<div className="menu-channel-drop-box">
				{showBackButton ? chName : "Home"}
				<img
					src={toggleImgSrc}
					alt="toggle"
					className="menu-channel-drop-down-button"
					onClick={handleDropDownBoxToggle}
					style={{ cursor: "pointer" }}
				/>
				{showDropDownBox && (
					<div className="menu-drop-down-channel-list">
						<button
							className="menu-drop-down-home-box"
							onClick={handleIntoHome}
						>
							<span className="menu-drop-down-home-text">
								{"< "}Home{" >"}
							</span>
						</button>
						{channels.length !== 0 && (
							<div className="menu-drop-down-channel-list-text">
								{"< "}channels{" >"}
							</div>
						)}
						{channels &&
						channels.map((channel) => (
							<div key={channel.chIdx} className="menu-drop-down-channel">
								<MyChannelList
									chIdx={channel.chIdx}
									chName={channel.chName}
									chUserCnt={channel.chUserCnt}
									setShowDropDownBox={setShowDropDownBox}
									isPrivate={false}
								/>
							</div>
						))}
						{privateChannels.length !== 0 && (
							<div className="menu-drop-down-channel-list-text">
								{"< "}private channels{" >"}
							</div>
						)}
						{privateChannels &&
						privateChannels.map((privateChannels, index) => (
							<div key={privateChannels.chIdx} className="menu-drop-down-channel">
								<MyChannelList
									chIdx={privateChannels.chIdx}
									chName={privateChannels.chName}
									chUserCnt={privateChannels.chUserCnt}
									setShowDropDownBox={setShowDropDownBox}
									isPrivate={true}
								/>
							</div>
						))}
						{dms.length !== 0 && (
							<div className="menu-drop-down-channel-list-text">
								{"< "}dm{" >"}
							</div>
						)}
						{dms &&
						dms.map((dm) => (
							<div key={dm.chIdx} className="menu-drop-down-channel">
								<MyDmList
									chIdx={dm.chIdx}
									chName={dm.chName}
									chUserCnt={dm.chUserCnt}
									setShowDropDownBox={setShowDropDownBox}
								/>
							</div>
						))}
					</div>
				)}
			</div>
			{showBackButton ? (
				showSetting &&
				<button
					className="menu-channel-new-box"
					onClick={handleSettingButton}
					style={{ fontSize: "20px" }}
					disabled={!showSetting}
				>
					Setting
				</button>
			) : (
				<button
					className="menu-channel-new-box"
					onClick={handleMakeNew}
				>
					new
				</button>
			)}
			<button
				className="menu-grin-button menu-start-button"
				onClick={handleStartClick}
				disabled={showWaiting}
			>
				{showWaiting ? "Waiting" : "START"}
			</button>
			{showCancel && (
				<button
					className="menu-grin-button menu-cancel-button"
					onClick={handleCancelClick}
				>
					Cancel
				</button>
			)}
			<Link to="/rank">
				{" "}
				<button className="menu-grin-button menu-lank-button">
					Rank
				</button>{" "}
			</Link>
			{showNewChat && <ChannelNew />}
			{isGameApply && (
				<GameApply
					playerNickName={playerNickName}
					mode={mode}
					handleAcceptButton={handleAcceptButton}
					handleRefuseButton={handleRefuseButton}
				></GameApply>
			)}
		</div>
	);
};

function GameApply({
	playerNickName,
	mode,
	handleAcceptButton,
	handleRefuseButton,
}: GameApplyProps) {
	var gameMode;
	if (mode === 0) gameMode = "easy";
	else if (mode === 1) gameMode = "normal";
	else if (mode === 2) gameMode = "hard";

	return (
		<div className="game-apply-box">
			<div>
				{playerNickName} 님이 게임({gameMode})을 신청했습니다.
			</div>
			<div>
				<button onClick={handleAcceptButton}>수락</button>
				<button onClick={handleRefuseButton}>거절</button>
			</div>
		</div>
	);
}

export default Menu;
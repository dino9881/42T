import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import ChannelNew from "../channel/ChannelNew"
import MyChannelList from "./MyChannelList";
import instance from "../refreshToken";
import MyDmList from "./MyDmList";
import './Menu.css';

type MenuProps = {
	showBackButton: boolean;
	channelName: string;
	channelIdx: number;

};

const Menu = ({ showBackButton, channelName, channelIdx}: MenuProps) => {
interface Channel {
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

	const [showWaiting, setShowWaiting] = useState(false);
	const [showCancel, setShowCancel] = useState(false);
	const [showDropDownBox, setShowDropDownBox] = useState(false); // 추가된 상태 값
	const [showNewChat, setShowNewChat] = useState(false);
	const navigate = useNavigate();
	const [channels, setChannels] = useState<Channel[]>([]);
	const [dms, setDms] = useState<Dm[]>([]);
	const location = useLocation();
	const state = location.state as { chIdx : number };
	if (state && state.chIdx) {
		instance
		.get(`http://localhost:5001/channel/name/${state.chIdx}`)
		.then((response) => {
			// 요청이 성공하면 데이터를 상태로 설정
			setChName(response.data.chName);
			setChIdx(state.chIdx);
		})
		.catch((error) => {
			// 요청이 실패하면 에러 처리
			console.error("API 요청 실패:", error);
		})};

	function getChannel() {
		instance.get("http://localhost:5001/channel/my/all")
			.then((response) => {
				// console.log(response.data);
				setChannels(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getDm() {
		instance.get("http://localhost:5001/channel/my/dm")
			.then((response) => {
				// console.log(response.data);
				setDms(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}


	const handleStartClick = () => {
		setShowWaiting(true);
		socket.emit("game-queue-join", {intraId:intraId, nickName: nickName});
		setShowCancel(true);
	};

	const handleCancelClick = () => {
		setShowWaiting(false);
		setShowCancel(false);
	};

	const handleDropDownBoxToggle = () => {
		setIsExpanded(!isExpanded);
		if (!isExpanded) {
			getChannel()
			getDm()
		}
		setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
		setShowDropDownBox(!showDropDownBox);
	};

	const handleMakeNew = () =>{
		setShowNewChat(!showNewChat);
	}
	
	const handleSettingButton = () => {
		instance.post(`http://localhost:5001/channel/author/${channelIdx}`)
              .then((response) => {
                // console.log(response.data)
                if (response.data!==true)
                {
                    alert("관리자만 접속할 수 있습니다!");
                    navigate('/chat', {
						state: {
						channelName : chName,
						chIdx : chIdx
						}
					});
                }
                else
				{navigate('/admin', {
					state: {
					channelName : chName,
					chIdx : chIdx
					}
				})}
              })
              .catch((error) => {
                console.error("API 요청 실패:", error);
              });
		
	}

	useEffect(() => {
		socket.on("game-ready", (data) => {
			const {player1, player2} = data;
			console.log(data);
			navigate('/game', {state: {player1, player2}})
        });

		socket.on("game-apply", (data) => {
			alert(`게임 신청 ${data}`);
        });
		instance.get("http://localhost:5001/auth/me")
		.then((response) => {
			setIntraId(response.data.intraId);
			setNickName(response.data.nickName);
			if (chName[0] === "#")
			instance.get(`http://localhost:5001/member/${chName.replace(response.data.intraId,"").replace("#","")}`)
			.then((response) => {
				setChName(response.data.nickName + " 와의 DM ");
			})
			.catch(() => {
				return ("error");
			});
		})
		.catch((error) => {
			console.log(error);
		});

	},[]);
	

	return (
		<div className="menu-box">
		<div className="menu-channel-drop-box" >
			{showBackButton ? chName : "Home"}
			<img src={toggleImgSrc} alt="toggle" className="menu-channel-drop-down-button" onClick={handleDropDownBoxToggle} style={{ cursor: 'pointer' }}/>
			{showDropDownBox && (
			<div className="menu-drop-down-channel-list">
				{/* <div className="menu-drop-down-channel-list-text">channel</div> */}
				{channels && <div className="menu-drop-down-channel-list-text">{'< '}channel{' >'}</div>}
				{channels && channels.map((channel, index) => (
					<div className="menu-drop-down-channel">
						<MyChannelList key={index} chIdx={channel.chIdx} chName={channel.chName} chUserCnt={channel.chUserCnt} setShowDropDownBox={setShowDropDownBox}/>
					</div>
				))}
				{dms && <div className="menu-drop-down-channel-list-text">{'< '}dm{' >'}</div>}
				{dms && dms.map((dm, index) => (
					<div className="menu-drop-down-channel">
						<MyDmList key={index} chIdx={dm.chIdx} chName={dm.chName} chUserCnt={dm.chUserCnt} setShowDropDownBox={setShowDropDownBox}/>
					</div>
				))}
			</div>
			)}
		</div>
		{showBackButton ? (
			<button className="menu-channel-new-box" onClick={handleSettingButton} style={{fontSize : "20px"}}>Setting</button>
		) : (
			<button className="menu-channel-new-box" onClick={handleMakeNew}>new</button>
		)}

		<button className="menu-grin-button menu-start-button" onClick={handleStartClick}>
			{showWaiting ? "Waiting" : "START"}
		</button>
		{showCancel && (
			<button className="menu-grin-button menu-cancel-button" onClick={handleCancelClick}>
			Cancel
			</button>
		)}
		<Link to="/rank"> <button className="menu-grin-button menu-lank-button">Rank</button> </Link>
		<button className="menu-grin-button menu-custom-button">custom</button>
		{showNewChat && <ChannelNew/>}
		</div>
	);
}

export default Menu

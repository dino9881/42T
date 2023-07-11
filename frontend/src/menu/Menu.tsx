import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Menu.css';
import ChannelNew from "../channel/ChannelNew"
import axios from "axios";
import MyChannelList from "./MyChannelList";
import instance from "../refreshToken";

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

// const Menu = ({ showBackButton}: MenuProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
	const [showWaiting, setShowWaiting] = useState(false);
	const [showCancel, setShowCancel] = useState(false);
	const [showDropDownBox, setShowDropDownBox] = useState(false); // 추가된 상태 값
	const [showNewChat, setShowNewChat] = useState(false);
	const navigate = useNavigate();
	
	const [channels, setChannels] = useState<Channel[]>([]);

	function getChannel() {
		instance.get("http://localhost:5001/channel/all")
			.then((response) => {
				console.log(response.data);
				setChannels(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleStartClick = () => {
		setShowWaiting(true);
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
		}
		setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
		setShowDropDownBox(!showDropDownBox);
	};

	const handleMakeNew = () =>{
		setShowNewChat(!showNewChat);
	}
	
	const handleSettingButton = () => {
		instance.post(`http://localhost:5001/channel/oper/${channelIdx}`)
              .then((response) => {
                console.log(response.data)
                if (response.data!==true)
                {
                    alert("관리자만 접속할 수 있습니다!");
                    navigate('/chat');
                }
                else
				{navigate('/admin', {
					state: {
					  channelName : channelName
					}
				  })};
              })
              .catch((error) => {
                console.error("API 요청 실패:", error);
              });
		
	}
	

	return (
		<div className="menu-box">
		<div className="menu-channel-drop-box" >
			{showBackButton ? channelName : "Home"}
			<img src={toggleImgSrc} alt="toggle" className="menu-channel-drop-down-button" onClick={handleDropDownBoxToggle} style={{ cursor: 'pointer' }}/>
			{showDropDownBox && (
			<div className="menu-drop-down-channel-list">
				{/* <div className="menu-drop-down-channel-list-text">channel</div> */}
				{channels && <div className="menu-drop-down-channel-list-text">{'< '}channel{' >'}</div>}
				{channels && channels.map((channel, index) => (
					<div className="menu-drop-down-channel">
						<MyChannelList key={index} chIdx={channel.chIdx} chName={channel.chName} chUserCnt={channel.chUserCnt} operatorId={channel.operatorId} setShowDropDownBox={setShowDropDownBox}
/>
						{/* <MyChannelList key={index} chIdx={channel.chIdx} chName={channel.chName} chUserCnt={channel.chUserCnt} operatorId={channel.operatorId}/> */}
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
		<Link to="/ranking"> <button className="menu-grin-button menu-lank-button">Rank</button> </Link>
		<button className="menu-grin-button menu-custom-button">custom</button>
		{showNewChat && <ChannelNew/>}
		</div>
	);
}

export default Menu

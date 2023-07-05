import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Menu.css';

type MenuProps = {
	showBackButton: boolean;
};

const Menu = ({ showBackButton}: MenuProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
	const [showWaiting, setShowWaiting] = useState(false);
	const [showCancel, setShowCancel] = useState(false);
	const [showDropDownBox, setShowDropDownBox] = useState(false); // 추가된 상태 값

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
		setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
		setShowDropDownBox(!showDropDownBox);
	};

	return (
		<div className="menu-box">
		<div className="menu-channel-drop-box" >
			{showBackButton ? "channelname" : "Home"}
			<img src={toggleImgSrc} alt="toggle" className="menu-channel-drop-down-button" onClick={handleDropDownBoxToggle} style={{ cursor: 'pointer' }}/>
			{showDropDownBox && (
			<div className="menu-drop-down-channel-list">
				<div className="menu-drop-down-channel">
				<img
					className="menu-drop-down-channel-avatar"
					// src={avatarUrl}
					src="img/avatar.jpeg"
					alt="User Avatar"
				/>
				{/* <span>{chName}</span> */}
				<span className="menu-drop-down-channel-text">tests1</span>
				</div>
			</div>
			)}
		</div>
		{showBackButton ? (
			<button className="menu-channel-new-box" style={{fontSize : "20px"}}>Setting</button>
		) : (
			<button className="menu-channel-new-box">new</button>
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
		</div>
	);
}

export default Menu;

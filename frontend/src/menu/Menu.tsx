import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Menu.css';
import ChannelNew from "../channel/ChannelNew"

type MenuProps = {
  showBackButton: boolean;
  // handleBackButton: () => void;
};

const Menu = ({ showBackButton}: MenuProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
  const [showWaiting, setShowWaiting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
  };

  const handleStartClick = () => {
    setShowWaiting(true);
    setShowCancel(true);
  };

  const handleCancelClick = () => {
    setShowWaiting(false);
    setShowCancel(false);
  };

  const handleMakeNew = () =>{
    setShowNewChat(!showNewChat);
  }

  const handleCloseMakeNew = () =>{
    setShowNewChat(false);
  }

  return (
    <div className="menu-box">
      <button className="menu-channel-drop-box" onClick={handleToggle}>
		{showBackButton ? "channelname" : "Home"}
        <img src={toggleImgSrc} alt="toggle" className="menu-channel-drop-down-button" />
      </button>
      {showBackButton ? (
        <button className="menu-channel-new-box" style={{fontSize : "20px"}}>Setting</button>
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

export default Menu;

import React, { useState } from "react";
import './FriendInfo.css';

interface FriendInfoProps {
	name: string;
	age: number;
	avatarUrl: string;
}

const FriendInfoSimple: React.FC<FriendInfoProps> = ({ name, age, avatarUrl }) => {
	return (
		<div className='friend-info-simple'>
			<div className='state-circle'></div>
			<div
				className='friend-info-avatar'
				style={{ backgroundImage: `url(${avatarUrl})` }}
			></div>
			<div className='friend-info-info'>
				<div className='friend-info-text'>
					<div className='small-square'>{name}</div>
					<div className='small-square'>{age}</div>
				</div>
				<div className='friend-info-button'>
					<div className="friend-button">
						<button className='dm-button'>메세지</button>
						<button className='vs-button'>1vs1</button>
					</div>
						<div className='small-square'>전적</div>
				</div>
			</div>
		</div>
	);
}

const FriendInfoFull: React.FC<FriendInfoProps> = ({ name, age, avatarUrl }) => {
	const handleClick = () => {
		console.log('친구학제됨');
	}

	return (
		<div className='friend-info-full'>
			<div className="rank">Rank {age}</div>
			<div className="score-table">
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
			</div>
			<button className="delete-friends"  onClick={handleClick}>친구삭제</button>
		</div>
	);
}

const FriendInfo: React.FC<FriendInfoProps> = ({ name, age, avatarUrl }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");

	const handleToggle = () => {
	  setIsExpanded(!isExpanded);
	  setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
	};

	return (
		<div>
			<div className={isExpanded ? 'friend-info-line-big' : 'friend-info-line-small'}>
				<FriendInfoSimple name={name} age={age} avatarUrl={avatarUrl}/>
				<img src={toggleImgSrc} alt="toggle" className="friend-toggle-down" onClick={handleToggle}></img>
				{isExpanded && <FriendInfoFull name={name} age={age} avatarUrl={avatarUrl} />}
			</div>
		</div>
	);
}

export default FriendInfo;
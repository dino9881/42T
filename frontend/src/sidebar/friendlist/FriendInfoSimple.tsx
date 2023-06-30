import React, { useState } from "react";
import { Link } from "react-router-dom";
import './FriendInfo.css';
import '../myinfo/MyInfo.css';

interface FriendInfoProps {
	nickName: string;
	rank: number;
	avatar: string;
}

const FriendInfoSimple: React.FC<FriendInfoProps> = ({ nickName, rank, avatar }) => {
	return (
		<div className='friend-info-simple'>
			<div className='state-circle'></div>
			<div
				className='friend-info-avatar'
				style={{ backgroundImage: `url(${avatar})` }}
			></div>
			<div className='friend-info-info'>
				<div className='friend-info-text'>
					<div className='small-square'>{nickName}</div>
					<div className='small-square'>{rank}</div>
				</div>
				<div className='friend-info-button'>
					<div className="friend-button">
						<Link to="/chat"> <button className='dm-button'>메세지</button> </Link>
						<button className='vs-button'>1vs1</button>
					</div>
					<div className='small-square'>전적</div>
				</div>
			</div>
		</div>
	);
}

export default FriendInfoSimple;
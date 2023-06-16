import React, { useState } from "react";
import './FriendInfo.css';
import '../myinfo/MyInfo.css';

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

export default FriendInfoSimple;
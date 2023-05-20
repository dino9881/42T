import React from "react";
import './FriendInfo.css';

interface FriendInfoProps {
	name: string;
	age: number;
	avatarUrl: string;
}

const FriendInfo: React.FC<FriendInfoProps> = ({ name, age, avatarUrl }) => {
	// console.log(avatarUrl);
	return (
		<div className='friend-info-line'>
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
					<button className='small-square'>전적</button>
				</div>
			</div>
		</div>
	);
}

export default FriendInfo;
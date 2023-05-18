import React from "react";
import './FriendInfo.css';

const FriendInfo = () => {
	return (
			<div className='friend-info-line'>
				<div className='state-circle'></div>
				<div className='friend-info-avatar'></div>
				<div className='friend-info-info'>
					<div className='friend-info-text'>
						<div className='small-square'></div>
						<div className='small-square'></div>
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
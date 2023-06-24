import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import './AddFriend.css';
import FriendInfoSimple from '../friendlist/FriendInfoSimple';

interface SearchFriendProps {
	friendStatus: number;
	onClose: () => void;
}

interface FriendInfoProps {
	name: string;
	rank: number;
	avatar: string;
}
// /memeber/nick/nickname
//   친구 삭제 delete friend/delete + 친구 nickname

const SearchFriend: React.FC<SearchFriendProps> = ({ friendStatus, onClose }) => {

	const name = "GOAT"
	const rank = 28
	const avatar = "avatar/GOAT.jpeg"

	return (
	  <div className='search-result'>
		<img
		  className='search-result-close-button'
		  src="close_button.svg"
		  alt="Close"
		  width="20"
		  height="20"
		  onClick={onClose}
		/>
		{friendStatus === 1 ?
			(<FriendInfoSimple  name={name} rank={rank} avatar={avatar}/>)
			: (<IsNotFriend name={name} rank={rank} avatar={avatar}/>)
		}
	  </div>
	);
};
  
const IsNotFriend: React.FC<FriendInfoProps> = ({ name, rank, avatar }) => {
	return (
		<div className='friend-info-simple'>
			<div
				className='friend-info-avatar'
				style={{ backgroundImage: `url(${avatar})` }}
			></div>
			<div className='friend-info-info'>
				<div className='friend-info-text'>
					<div className='small-square'>{name}</div>
					<div className='small-square'>{rank}</div>
				</div>
				<div className='friend-info-button'>
					<div className="friend-button">
						<button className='small-square'>친구 추가</button>
					</div>
						<div className='small-square'>전적</div>
				</div>
			</div>
		</div>
	)
}

  export default SearchFriend;

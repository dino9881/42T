import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import './AddFriend.css';
import FriendInfoSimple from '../friendlist/FriendInfoSimple';

interface SearchFriendProps {
	friendStatus: number;
	onClose: () => void;
}

interface FriendInfoProps {
	nickName: string;
	rank: number;
	avatar: string;
}
// /memeber/nick/nickname
//   친구 삭제 delete friend/delete + 친구 nickname

const SearchFriend: React.FC<SearchFriendProps> = ({ friendStatus, onClose }) => {

	const nickName = "GOAT"
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
			(<FriendInfoSimple  nickName={nickName} rank={rank} avatar={avatar}/>)
			: (<IsNotFriend nickName={nickName} rank={rank} avatar={avatar}/>)
		}
	  </div>
	);
};
  
const IsNotFriend: React.FC<FriendInfoProps> = ({ nickName, rank, avatar }) => {
	const handleAdd = () => {
		console.log('친구 추가');
	}

	const handleBlock = () => {
		console.log('차단');
	}

	return (
		<div className='friend-info-simple'>
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
						<button className='dm-button' onClick={handleAdd}>친구추가</button>
						<button className='vs-button' onClick={handleBlock}>차단</button>
					</div>
						<div className='small-square'>전적</div>
				</div>
			</div>
		</div>
	)
}

  export default SearchFriend;

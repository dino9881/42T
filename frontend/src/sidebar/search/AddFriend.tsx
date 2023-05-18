import React from 'react';
import './AddFriend.css';

const AddFriend = () => {
	return (
		<div className='add-friend'>
			<input id='search-friend' placeholder='검색' maxLength={20}></input>
			<button id='serch-friend-button'>친구추가</button>
		</div>	
	);
};

export default AddFriend;

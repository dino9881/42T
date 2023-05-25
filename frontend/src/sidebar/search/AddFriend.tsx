import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import './AddFriend.css';

const AddFriend = () => {
	const [text, setText] = useState<string>("");

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
	  setText(e.target.value);
	};
  
	const onReset = () => {
		console.log(text);
	  setText("");
	};

	const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
		  onReset();
		}
	  };

	return (
		<div className='add-friend'>
			<input
			id='search-friend'
			placeholder='검색'
			onChange={onChange}
			onKeyPress={onKeyPress}
			value={text}
			maxLength={12}
		/>
			<button id='serch-friend-button' onClick={onReset}>친구추가</button>
		</div>	
	);
};

export default AddFriend;

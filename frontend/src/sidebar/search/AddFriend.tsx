import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import SearchFriend from './SearchFriend';
import './AddFriend.css';

interface IsFriendProps {
	friendStatus: number;
	onClose: () => void;
}

const AddFriend = () => {
  const [text, setText] = useState<string>("");
  const [friendStatus, setFriendStatus] = useState<number>(-1); // -1: 초기 상태, 0: IsNotFriend, 1: IsFriend

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onReset = () => {
    console.log(text);
    // 특정 조건에 따라 friendStatus 값을 변경
    const newFriendStatus = Math.random() < 0.5 ? 0 : 1;
    setFriendStatus(newFriendStatus);
    console.log(newFriendStatus);
    setText("");
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onReset();
    }
  };

  const resetFriendStatus = () => {
    setFriendStatus(-1);
  };

  const closeFriendStatus = () => {
    resetFriendStatus();
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
      {friendStatus !== -1 && (
        <SearchFriend friendStatus={friendStatus} onClose={closeFriendStatus} />
      )}
    </div>
  );
};

export default AddFriend;


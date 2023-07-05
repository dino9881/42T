import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import SearchFriend from './SearchFriend';
import './AddFriend.css';
import axios from 'axios';
import { locale } from 'yargs';

interface IsFriendProps {
	friendStatus: number;
	onClose: () => void;
}

const AddFriend = () => {
  const [text, setText] = useState<string>("");
  const [friendStatus, setFriendStatus] = useState<number>(-1); // -1: 초기 상태, 0: IsNotFriend, 1: IsFriend
  const [intraId, setintraId] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onReset = () => {
    // console.log(text);
    axios.get(`http://localhost:5001/member/search/${text}`).then((response) => {
      console.log(response)
      if (response.data.isFriend === true){
        setFriendStatus(1);
      }
      else {
        setFriendStatus(0);
      }
      setintraId(response.data.intraId);
    })
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
        <SearchFriend intraId={intraId} friendStatus={friendStatus} onClose={closeFriendStatus} />
      )}
    </div>
  );
};

export default AddFriend;


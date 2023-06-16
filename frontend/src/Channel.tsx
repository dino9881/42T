import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

interface PwInputProps {
    channelName: string;
}

function Channel(){
    return <div className="channel_list">
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
    </div>
}

function PwInput({ channelName }: PwInputProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/chat', { state: { channelName } });
  };

  return (
    <div className="pw-inputbox">
      <input type="text" name="pw-input" className="pw-input" />
      <Button onClick={handleButtonClick} variant="light" className="pw-input-button" size="sm">
        Enter
      </Button>
    </div>
  );
}

  function ChannelRoom() {
    const channelName = '히킴 해삼 말미잘 멍충이';
  
    return (
      <div className="chan-room">
        <div className="chan-lockcheck">
          <img src="/channel/lock.png" alt="lock" />
        </div>
        <div className="chan-hostinfo">
          <div className="chan-hostimg">
            <img src="/avatar/son.jpeg" alt="son" />
          </div>
          <span className="chan-hostname">방장_이름</span>
        </div>
        <div className="chan-info">
          <span className="chan-name">{channelName}</span>
          <PwInput channelName={channelName} />
          <div className="chan-count">3/5</div>
        </div>
      </div>
    );
  }

function ChannelRow() {
    return <div className="chan-rowbox">
    <div className="chan-leftbox">
        <ChannelRoom></ChannelRoom>
    </div>
    <div className="chan-rightbox">
        <ChannelRoom></ChannelRoom>
    </div>
</div>
}

export default Channel;

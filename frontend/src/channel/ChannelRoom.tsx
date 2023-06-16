import PwInput from "./PwInput";

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

export default ChannelRoom;
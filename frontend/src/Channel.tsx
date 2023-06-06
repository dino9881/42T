import React from "react";
import { Button } from "react-bootstrap";

function Channel(){
    return <div className="channel_list">
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>
        <ChannelRow></ChannelRow>

    </div>
}
// function Chat(){
//     return <div className="chat">
//         <h1>Chatting</h1>
//         <ChatBox></ChatBox>
//         <ChatBox></ChatBox>
//         <ChatBox></ChatBox>
//         <ChatInput />
//     </div>
// }

// function ChatInput(){
//     return <div className="chat-inputbox">
//         <input type="text" name="chat-input" className="chat-input"></input>
//         <Button variant="primary" className="chat-input-button">입력</Button>
//     </div>
// }

function PwInput() {
    return <div className="pw-inputbox">
        <input type="text" name="pw-input" className="pw-input"></input>
        <Button variant="light" className="pw-input-button" size="sm">P W</Button>
    </div>
}



function ChannelRoom() {
    return <div className="chan-room">
        <div className="chan-lockcheck">
            <img src="/channel/lock.png" alt="lock"></img>
        </div>
        <div className="chan-hostinfo">
            <div className="chan-hostimg">
                <img src="/avatar/son.jpeg" alt="son"></img>
            </div>
            <span className="chan-hostname">방장_이름</span>
        </div>
        <div className="chan-info">
            <span className="chan-name">일이삼사오육칠팔구십일이삼사오육칠팔구십</span>
            <PwInput />
            <div className="chan-count">3/5</div>
        </div>
    </div>
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
// function ChatBox(){
//     return <div className="chat-box">
//         <div className="chat-userimg">img</div>
//         <div className="chat-userinfo">
//             <span className="chat-username">사용자 이름</span>
//             <span className="chat-userchat">사용자 채팅</span>
//         </div>
//     </div>
// }

// export default Cha;
export default Channel;
import React from "react";
import { Button } from "react-bootstrap";
function Chat(){
    return <div className="chat">
        <h1>Chatting</h1>
        <ChatBox></ChatBox>
        <ChatBox></ChatBox>
        <ChatBox></ChatBox>

        
        <ChatInput />
    </div>
}

function ChatInput(){
    return <div className="chat-inputbox">
        <input type="text" name="chat-input" className="chat-input"></input>
        <Button variant="primary" className="chat-input-button">입력</Button>
    </div>
}

function ChatBox(){
    return <div className="chat-box">
        <div className="chat-userimg">img</div>
        <div className="chat-userinfo">
            <span className="chat-username">사용자 이름</span>
            <span className="chat-userchat">사용자 채팅</span>
        </div>
    </div>
}

export default Chat;
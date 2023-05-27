import React from "react";
import { Button } from "react-bootstrap";

interface Message {
    name : string,
    text : string
}

const msgList = [
    {
        name : "jonkim",
        text : "hi"
    },

    {
        name : "yyoo",
        text : "hihi"
    },
    {
        name : "jonkim",
        text : "bye"
    },

    {
        name : "yyoo",
        text : "byebye"
    },
    {
        name : "yyoo",
        text : "byebye"
    },
  ];
  

function Chat(){
    return <div className="chat">
        <h1>Chatting</h1>
       {msgList.map(tallker => <ChatBox name={tallker.name} text={tallker.text}/>)}
        <ChatInput />
    </div>
}

function ChatInput(){
    return <div className="chat-inputbox">
        <input type="text" name="chat-input" className="chat-input"></input>
        <Button variant="primary" className="chat-input-button">입력</Button>
    </div>
}

function ChatBox({name, text} : Message){
    return <div className="chat-box">
        <div className="chat-userimg">img</div>
        <div className="chat-userinfo">
            <span className="chat-username">{name}</span>
            <span className="chat-userchat">{text}</span>
        </div>
    </div>
}

export default Chat;
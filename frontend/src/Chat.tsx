import React from "react";
import { useState,ChangeEvent, FormEvent } from "react";

interface Message {
    id : number,
    name : string,
    text : string
}

const msgList = [
    {
        id : 1,
        name : "jonkim",
        text : "hi"
    },

    {
        id : 2,
        name : "yyoo",
        text : "hihi"
    },
    {
        id : 3,
        name : "jonkim",
        text : "bye"
    },

    {
        id : 4,
        name : "yyoo",
        text : "byebye"
    },
    {
        id : 5,
        name : "yyoo",
        text : "byebye"
    },
    {
        id : 6,
        name : "yyoo",
        text : "byebye"
    },
    {
        id : 7,
        name : "yyoo",
        text : "byebye"
    },
    
  ];
  

function Chat(){
    return <div className="chat">
        <div className="chat-scroll">
        {msgList.map(message => <ChatBox key={message.id} id={message.id} name={message.name} text={message.text}/>)}
        </div>
        <ChatInput />
    </div>
}

function ChatInput(){
    const [text, setText] = useState('');
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
      };
      const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      };
    return <div className="chat-inputbox">
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        onChange={onChange} 
                        value={text}
                        name="chat-input"
                        className="chat-input"
                    />
                     <button className="chat-input-button">제출</button>
                 </form>
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
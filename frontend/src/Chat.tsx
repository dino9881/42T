import React, { useEffect } from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { ConnectionState } from "./ConnectionState";
import { socket } from "./socket";
import { useLocation } from "react-router-dom";
import Contents from "./Contents";
import Sidebar from "./sidebar/Sidebar";
import Menu from "./menu/Menu";

interface Message {
    name: string;
    text: string;
}

function Chat() {
    return <div>
         <Contents headerComponent={<Menu showBackButton={true}/>} mainComponent={<ChatComponent/>}/>
         <Sidebar />
    </div>
    ;
}

function ChatComponent() {
    console.log(socket);
    const location = useLocation();
    const [channelName, setChannelName] = useState("");
    useEffect(() => {
        const state = location.state as { channelName: string };
        if (state && state.channelName) {
          setChannelName(state.channelName);
        } else {
          setChannelName("error");
        }
      }, [location.state]);
    const addMessage = (message: Message) => {
        setMsgList((prevMsgList) => [...prevMsgList, message]);
      };
    const [msgList, setMsgList] = useState<Message[]>([]);

    socket.emit("enter-channel", channelName, "jonkim");
    socket.on("welcome", (nickName: string) => {
        console.log(nickName);
        const newMessage = { name: nickName, text: `${nickName} : 이 입장했습니다.` };
        addMessage(newMessage);
    });
    return (
        
        <div className="chat">
            <div>{channelName}</div>
            <div className="chat-scroll">
                {msgList.map((message) => (
                    <ChatBox
                        name={message.name}
                        text={message.text}
                    />
                ))}
            </div>
            <ChatInput addMessage={addMessage}/>
        </div>
    );
}

function ChatInput({ addMessage }: { addMessage: (message: Message) => void }) {
    const [text, setText] = useState("");
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = {  name: "나", text: text };
        addMessage(newMessage);
        setText("");
    };

    return (
        <div className="chat-inputbox">
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
    );
}

function ChatBox({ name, text }: Message) {
    return (
        <div className="chat-box">
            <div className="chat-userimg">img</div>
            <div className="chat-userinfo">
                <span className="chat-username">{name}</span>
                <span className="chat-userchat">{text}</span>
            </div>
        </div>
    );
}

export default Chat;

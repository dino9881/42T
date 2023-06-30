import React, { useEffect } from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { ConnectionState } from "./ConnectionState";
import { socket } from "./socket";
import { useLocation } from "react-router-dom";
import Contents from "./Contents";
import Sidebar from "./sidebar/Sidebar";
import Menu from "./menu/Menu";
import axios from "axios";

interface Message {
    id: number;
    name: string;
    text: string;
}

function Chat() {
    return (
        <div>
            <Contents
                headerComponent={<Menu showBackButton={true} />}
                mainComponent={<ChatComponent />}
            />
            <Sidebar />
        </div>
    );
}

function ChatComponent() {
    const location = useLocation();
    const [channelName, setChannelName] = useState("");
    useEffect(() => {
        const state = location.state as { chIdx: number };
        if (state && state.chIdx) {
            axios
                .get(`http://localhost:5001/channel/name/${state.chIdx}`)
                .then((response) => {
                    // 요청이 성공하면 데이터를 상태로 설정
                    // setChannelName(response.data);
                    setChannelName(response.data.chName);
                    console.log(channelName);
                })
                .catch((error) => {
                    // 요청이 실패하면 에러 처리
                    console.error("API 요청 실패:", error);
                });
            // setChannelName(state.channelName);
        } else {
            setChannelName("error");
        }
    }, [location.state]);
    const addMessage = (message: Message) => {
        setMsgList((prevMsgList) => [...prevMsgList, message]);
    };
    const [msgList, setMsgList] = useState<Message[]>([]);
    return (
        <div className="chat">
            <div>{channelName}</div>
            <div className="chat-scroll">
                {msgList.map((message) => (
                    <ChatBox
                        key={message.id}
                        id={message.id}
                        name={message.name}
                        text={message.text}
                    />
                ))}
            </div>
            <ChatInput addMessage={addMessage} />
        </div>
    );
}

function ChatInput({ addMessage }: { addMessage: (message: Message) => void }) {
    const [text, setText] = useState("");
    const [msgId, setMsgId] = useState(0);
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = { id: msgId, name: "new", text: text };
        addMessage(newMessage);
        setMsgId(msgId + 1);
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
                    autoComplete="off"
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

import React, { useEffect } from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { ConnectionState } from "./ConnectionState";
import { socket } from "./socket";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Message {
    id: number;
    name: string;
    text: string;
}

interface MessageItem {
    name: string;
    text: string;
    isMine: boolean;
}

interface ChatProps {
    channelName: string;
    channelInit: (channelName: string) => void;
}

function Chat({ channelName, channelInit }: ChatProps) {
    const location = useLocation();
    const [nickName, setNickName] = useState("");
    const [msgList, setMsgList] = useState<MessageItem[]>(() => initialData());
    axios.get("http://localhost:5001/auth/me").then((response) => {
        // console.log(response);
        setNickName(response.data.nickName);
    });

    function initialData(): MessageItem[] {
        return [];
    }

    useEffect(() => {
        const state = location.state as { chIdx: number };
        if (state && state.chIdx) {
            axios
                .get(`http://localhost:5001/channel/name/${state.chIdx}`)
                .then((response) => {
                    // 요청이 성공하면 데이터를 상태로 설정
                    // setChannelName(response.data);
                    channelInit(response.data.chName);
                    // console.log(`channel = s{channelName}`);
                })
                .catch((error) => {
                    // 요청이 실패하면 에러 처리
                    console.error("API 요청 실패:", error);
                });
            // setChannelName(state.channelName);
        } else {
            channelInit("error");
        }

        socket.on("welcome", (nickName) => {
            const newMessage = {
                name: "System",
                text: `${nickName} : 이 입장했습니다.`,
            };
            addMessage(newMessage);
        });

        socket.on("send-message", (payload: any) => {
            console.log("send-message");
            const { nickname, text } = payload;
            const newMessage = { name: nickname, text: text };
            addMessage(newMessage);
        });
    }, []);

    useEffect(() => {
        if (channelName && nickName) {
            socket.emit("enter-channel", {
                channelName: channelName,
                nickname: nickName,
            });
        }
    }, [channelName]);

    const addMessage = (messageText: MessageText) => {
        const message = {
            name: messageText.name,
            text: messageText.text,
            isMine: false,
        };
        setMsgList((prevMsgList) => [...prevMsgList, message]);
    };

    const addMyMessage = (messageText: MessageText) => {
        const message = {
            name: messageText.name,
            text: messageText.text,
            isMine: true,
        };
        setMsgList((prevMsgList) => [...prevMsgList, message]);
    };

    function exitChannel() {}

    return (
        <div className="chat">
            <span>{channelName}</span>
            <button onClick={exitChannel}>채널 나가기</button>
            <div className="chat-scroll">
                {msgList.map((message, index) => (
                    <ChatItem
                        key={index}
                        name={message.name}
                        text={message.text}
                        isMine={message.isMine}
                    />
                ))}
            </div>
            <ChatInput
                addMyMessage={addMyMessage}
                nickname={nickName}
                channelname={channelName}
            />
        </div>
    );
}

function ChatInput({
    addMyMessage,
    nickname,
    channelname,
}: {
    addMyMessage: (message: MessageText) => void;
    nickname: string;
    channelname: string;
}) {
    const [text, setText] = useState("");
    const [msgId, setMsgId] = useState(0);
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = { name: "나", text: text };
        addMyMessage(newMessage);
        socket.emit("message", { channelname, nickname, text });
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

function ChatItem({ name, text, isMine }: MessageItem) {
    const getItemType = (): string => {
        if (isMine) {
            return "chat-box-mine";
        } else {
            return "chat-box";
        }
    };
    return (
        <div className={`${getItemType()}`}>
            <div className="chat-userimg">img</div>
            <div className="chat-userinfo">
                <span className="chat-username">{name}</span>
                <span className="chat-userchat">{text}</span>
            </div>
        </div>
    );
}

export default Chat;

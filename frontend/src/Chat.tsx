import React, { useEffect } from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { socket } from "./socket";
import { useLocation } from "react-router-dom";
import Contents from "./Contents";
import Sidebar from "./sidebar/Sidebar";
import Menu from "./menu/Menu";
import axios from "axios";

interface MessageText {
    name: string;
    text: string;
}

function Chat() {
    return <div>
         <Contents headerComponent={<Menu showBackButton={true}/>} mainComponent={<ChatComponent/>}/>
    </div>
    ;
}


function ChatComponent() {
    const location = useLocation();
    const [channelName, setChannelName] = useState("");
    const [nickName, setNickName] = useState("jonkim");
    const [msgList, setMsgList] = useState<MessageText[]>(() => initialData());
    axios.get('http://localhost:5001/auth/me').then((response) => {
			// console.log(response);
					setNickName(response.data.nickName); 
			});
	

    function initialData(): MessageText[]  {
        return [];
      }

    useEffect(() => {
        const state = location.state as { chIdx : number };
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
        socket.connect();

        socket.on("welcome", (nickName) => {
            const newMessage = {name: nickName, text: `${nickName} : 이 입장했습니다.` };
            addMessage(newMessage);
        });


        socket.on("send-message", (payload:any) => {
            console.log("send-message");
            const {nickname, text}=payload;
            const newMessage = {name: nickname, text: text};
            addMessage(newMessage);
        });
    }, []);
    
    useEffect(() => {
        if(channelName)
        {  
              socket.emit("enter-channel", {channelName: channelName,nickname: nickName});
        }
    }, [channelName])
    
    const addMessage = (messageText: MessageText) => {
        const message = {name: messageText.name, text: messageText.text };
        setMsgList((prevMsgList) => [...prevMsgList, message]);
      };

    return (  
        <div className="chat">
            <div>{channelName}</div>
            <div className="chat-scroll">
                {msgList.map((message, index) => (
                    <ChatBox
                        key={index}
                        name={message.name}
                        text={message.text}
                    />
                ))}
            </div>
            <ChatInput addMessage={addMessage} nickname={nickName} channelname={channelName} />
        </div>
    );
}

function ChatInput({ addMessage, nickname, channelname }: { addMessage: (message: MessageText) => void, nickname: string, channelname:string }) {
    const [text, setText] = useState("");
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = {name: "나", text: text };
        addMessage(newMessage);
        socket.emit("message",{channelname, nickname, text});
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

function ChatBox({ name, text }: MessageText) {
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

import React, { useEffect } from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import './Chat.css';
import instance from "../refreshToken";
import { NavItem } from "react-bootstrap";

interface MessageText {
    nickName: string;
    message: string;
}

interface MessageItem {
    nickName: string;
    message: string;
    avatar: string;
}

interface ChatItem {
    nickName: string;
    message: string;
    avatar: string;
    mynickname:string;
}

interface ChatProps {
    channelName: string;
    channelInit: (channelName : string, channelIdx : number) => void;
}



function Chat({channelName , channelInit}:ChatProps) {
    const location = useLocation();
    const [nickName, setNickname] = useState("");
    const [avatar, setAvatar] = useState("");
    const [msgList, setMsgList] = useState<MessageItem[]>(() => initialData());
    const navigate = useNavigate();
	
    
    function initialData(): MessageItem[]  {
        return [];
    }
    
    useEffect(() => {
        instance.get('http://localhost:5001/auth/me').then((response) => {
            // console.log(response);
            setNickname(response.data.nickName);
            setAvatar(response.data.avatar);
            socket.emit("enter-channel", {channelName: channelName,nickName: response.data.nickName});
                    });
        const state = location.state as { chIdx : number };
        if (state && state.chIdx) {
            instance
            .get(`http://localhost:5001/channel/name/${state.chIdx}`)
            .then((response) => {
                // 요청이 성공하면 데이터를 상태로 설정
                channelInit(response.data.chName, state.chIdx);
                localStorage.setItem('chName', response.data.chName);
                localStorage.setItem('chIdx', state.chIdx.toString());
                
            })
            .catch((error) => {
                // 요청이 실패하면 에러 처리
                console.error("API 요청 실패:", error);
            });

            instance
            .get(`http://localhost:5001/channel/message/${state.chIdx}`)
            .then((response) => {
                // 요청이 성공하면 데이터를 상태로 설정
                console.log(response.data)
                setMsgList(response.data);
            })
            .catch((error) => {
                // 요청이 실패하면 에러 처리
                console.error("API 요청 실패:", error);
            });
            
            instance
            .get(`http://localhost:5001/channel/message/${state.chIdx}`)
            .then((response) => {
                // 요청이 성공하면 데이터를 상태로 설정
                console.log(response.data);

            })
            .catch((error) => {
                // 요청이 실패하면 에러 처리
                console.error("API 요청 실패:", error);
            });
        } else {
            channelInit("error", 0);
        }
        

        socket.on("welcome", (nickName) => {
            const newMessage = {nickName: "System", message: `${nickName} : 이 입장했습니다.` };
            console.log("enter");
            addMessage(newMessage, "");
        });


        socket.on("send-message", (payload:any) => {
            const {nickName, message, avatar}=payload;
            console.log(payload);
            const newMessage = {nickName: nickName, message: message};
            addMessage(newMessage, avatar);
        });
    }, []);
    
    useEffect(() => {
        if(channelName && nickName)
        {  
        }
    }, [channelName])

    useEffect(() => {
        var objDiv = document.getElementById("chat-scroll");
        if (objDiv)
              objDiv.scrollTop = objDiv.scrollHeight;
    }, [msgList])
    
    const addMessage = (messageText: MessageText, avatar:string) => {
        const message = {nickName: messageText.nickName, message: messageText.message, avatar: avatar };
        setMsgList((prevMsgList) => [...prevMsgList, message]);
      };

      const addMyMessage = (messageText: MessageText) => {
        const message = {nickName: messageText.nickName, message: messageText.message,  avatar: avatar };
        setMsgList((prevMsgList) => [...prevMsgList, message]);
      };

    function exitChannel(){
        const state = location.state;
       if (state && state.chIdx) {

        instance
            .post(`http://localhost:5001/channel/leave/${state.chIdx}`, {memberId : nickName})
            .then((response) => {
                console.log(response.data);
                socket.emit("leave-channel",{channelName, nickName});
            })
            .catch((error) => {
                console.error("API 요청 실패:", error);
            });
            navigate('/main', {
                state: {
                }
              });
        }
    }

    return (  
        <div className="chat">
            <span>{channelName}</span>
            <button onClick={exitChannel}>채널 나가기</button>
            <div className="chat-scroll" id="chat-scroll">
                {msgList.map((message, index) => (
                    <ChatItem
                        key={index}
                        nickName={message.nickName}
                        message={message.message}
                        avatar={message.avatar}
                        mynickname={nickName}
                    />
                ))}
            </div>
            <ChatInput addMyMessage={addMyMessage} nickName={nickName} channelName={channelName} avatar={avatar} />
        </div>
    );
}

function ChatInput({ addMyMessage, nickName, channelName, avatar }: { addMyMessage: (message: MessageText) => void, nickName: string, channelName:string, avatar:string }) {
    const [message, setMessage] = useState("");
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = {nickName: "나", message: message };
        addMyMessage(newMessage);
        socket.emit("message",{channelName, nickName, message, avatar});
        setMessage("");
    };
    return (
        <div className="chat-inputbox">
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    onChange={onChange}
                    value={message}
                    name="chat-input"
                    className="chat-input"
                    autoComplete="off"
                />
                <button className="chat-input-button">제출</button>
            </form>
        </div>
    );
}

function ChatItem({ nickName, message, avatar, mynickname }: ChatItem ) {
    const getItemType = (): string => {
        if (nickName === mynickname || nickName === "나") {
          return 'chat-box-mine';
        } else {
          return 'chat-box';
        }
      };

      const getSender = (): string => {
        if (nickName === mynickname ) {
          return '나';
        } else {
          return nickName;
        }
      };
    return (
        <div className={`${getItemType()}`}>
            <div className="chat-userimg-box" >
                <img className="chat-userimg" src={avatar} alt=""  />
            </div>
            <div className="chat-userinfo">
                <span className="chat-username">{getSender()}</span>
                <span className="chat-userchat">{message}</span>
            </div>
        </div>
    );
}

export default Chat;

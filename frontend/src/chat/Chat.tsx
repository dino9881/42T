import React, { useEffect } from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import './Chat.css';
import instance from "../refreshToken";
import adminimg from '../../public/admin.jpg'

interface MessageText {
    nickName: string;
    message: string;
}

interface MessageItem {
    nickName: string;
    message: string;
    avatar: string;
    channel?: string;
}

interface ChatItemProps {
    nickName: string;
    message: string;
    avatar: string;
    mynickname:string;
}

interface ChatProps {
    channelInit: (channelName : string, channelIdx : number) => void;
    isDM: boolean;
}



function Chat({channelInit}:ChatProps) {
    const location = useLocation();
    const [nickName, setNickname] = useState("");
    const [avatar, setAvatar] = useState("");
    const [channelName, setChannelName] = useState("");
    const [msgList, setMsgList] = useState<MessageItem[]>(() => initialData());
    const [isDM, setIsDM]  = useState(true);

    const navigate = useNavigate();
	    
    function initialData(): MessageItem[]  {
        return [];
    }
    
    useEffect(() => {
        instance.get(`${process.env.REACT_APP_BACK_URL}/auth/me`).then((response) => {
            setNickname(response.data.nickName);
            setAvatar(response.data.avatar);
            socket.emit("enter-channel", {channelName: channelName,nickName: response.data.nickName});
        });
            
        const state = location.state as { chIdx : number };
        if (state && state.chIdx) {
            instance
            .get(`${process.env.REACT_APP_BACK_URL}/channel/${state.chIdx}`)
            .then((response) => {
                // 요청이 성공하면 데이터를 상태로 설정
                channelInit(response.data.chName, state.chIdx);
                localStorage.setItem('chName', response.data.chName);
                localStorage.setItem('chIdx', state.chIdx.toString());
                setChannelName(response.data.chName);
                setIsDM(response.data.isDM);
            })
            .catch(() => {
                navigate('/main');
                alert("비정상 접근")
            });

            instance
            .get(`${process.env.REACT_APP_BACK_URL}/channel/message/${state.chIdx}`)
            .then((response) => {
                // 요청이 성공하면 데이터를 상태로 설정
                setMsgList(response.data);
            })
            .catch(() => {
            });
            
            instance
            .get(`${process.env.REACT_APP_BACK_URL}/channel/message/${state.chIdx}`)
            .then((response) => {
                // 요청이 성공하면 데이터를 상태로 설정

            })
            .catch(() => {
            });
        } else {
            channelInit("error", 0);
        }

        socket.on("welcome", (nickName, avatar) => {
            const newMessage = {nickName: "System", message: `${nickName} 님이 입장했습니다.` , avatar: avatar};
            addMessage(newMessage, avatar);
        });

        socket.on("leave-channel", (nickName, avatar) => {
            const newMessage = {nickName: "System", message: `${nickName} 님이 채널을 나갔습니다.` , avatar: avatar};
            addMessage(newMessage, avatar);
        });

        socket.on("send-message", (payload:MessageItem) => {
            const { nickName, message, avatar, channel } = payload;
            if (channelName === channel){
                const newMessage = {nickName: nickName, message: message};
                addMessage(newMessage, avatar);                
            }
        });

        socket.on("delete", () => {
            navigate('/main');
            alert("방 폭파됨");
        });

        socket.on("kick", () => {
            navigate('/main');
            alert("너 퇴장당함");
        });
        socket.on("ban", () => {
            navigate('/main');
            alert("너 밴당함");
        });
        socket.on("mute", () => {
            alert("너 뮤트당함");
        });
        socket.on("admin", () => {
            alert("너 관리자됨");
        });

        return () => {
            socket.off("send-message");
            socket.off("welcome");
            socket.off("kick");
            socket.off("mute");
            socket.off("ban");
            socket.off("admin");
            socket.off("delete");
            socket.off("leave-channel");

          };
    }, [channelName, channelInit, location.state]);

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
        socket.emit("leave-channel", {channelName : channelName, chIdx:state.chIdx, nickName:nickName})
        navigate('/main');
       }
    }

    return (  
        <div className="chat">
            <div className="chat-header-box">
                {!isDM && <img className="out_of_channel_button" src="out_of_channel.svg" alt="out_of_channel" onClick={exitChannel} style={{ cursor: 'pointer' }} />}
                {!isDM &&<span>채널 나가기</span>}
            </div>
            <div className="chat-scroll" id="chat-scroll">
                {msgList && msgList.map((message, index) => (
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
        if (message.trim() === "") {
            return;
        }
        const newMessage = {nickName: "나", message: message };
        addMyMessage(newMessage);
        socket.emit("message",{channelName, nickName, message : message, avatar});
        setMessage("");
    };
    return (
        <form onSubmit={onSubmit} className="chat-inputbox">
            <input
                type="text"
                onChange={onChange}
                value={message}
                name="chat-input"
                className="chat-input"
                autoComplete="off"
            />
            <button type="submit" className="chat-input-button">
                <img src="send_button.svg" alt="send_button" className="chat-input-img"/>
            </button>
        </form>
    );
}

function ChatItem({ nickName, message, avatar, mynickname }: ChatItemProps ) {
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
            {getItemType() === 'chat-box-mine' && (
                <>
                    <span className="chat-userchat">{message}</span>
                </>
            )}
            {getItemType() === 'chat-box' && (
                <>
                <img className="chat-userimg-box" src={avatar} alt="" />
                <div className="chat-userinfo">
                    <span className="chat-username">{getSender()}</span>
                    <span className="chat-userchat">{message}</span>
                </div>
                </>
            )}
        </div>
    );
}

export default Chat;
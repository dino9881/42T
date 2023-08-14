import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import './ChannelAdmin.css'
import instance from "../../refreshToken";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";

interface UserInfos {
    intraId : string,
    nickName : string, 
}

interface SettingInfo {
    setting : string,
    chIdx : number,
    ownerId : string,
    userList:UserInfos[],
    banList:UserInfos[],
}

interface ChannelAdminProps{
    channelName:string,
    channelIdx:number
}

interface AdminUserListProps{
    userList:UserInfos[];
    banList:UserInfos[];
}

interface PassSettingProps{
    channelName:string,
    channelIdx:number
    isPass:boolean;
}

function ChannelAdmin({channelName, channelIdx} :ChannelAdminProps){
        const [banList, setBanList] = useState<UserInfos[]>(() => initialData());
        const [userList, setUserList] = useState<UserInfos[]>(() => initialData());
        const [inviteName, setInviteName] = useState("");
        const navigate = useNavigate();
        const [isOwner , setOwner] = useState(false);
        const [ownerId , setOwnerID] = useState("");

        const [isPrivate , setIsPrivate] = useState(false);

        const [isPass , setIsPass] = useState(false);
        
        const chName = channelName;
        const chIdx = channelIdx;
        
        function initialData(): UserInfos[]  {
            return [];
        }
        
        const onChange = (event: ChangeEvent<HTMLInputElement>) => {
            setInviteName(event.target.value);
        };
        function handleOnclick () {
            navigate('/chat', {
						state: {
						channelName : chName,
						chIdx : chIdx
						}
					});
          }
          const handleInvite  = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const targetIntraId = userList.find(user => user.nickName === inviteName);
            if (targetIntraId)
            {
                alert("이미 채팅방에 있는 사람입니다.")
                setInviteName("")
                return;
            }
           socket.emit("channel-invite", {nickName : inviteName, channelName : channelName});
           console.log(`nick = ${inviteName}, channel = ${channelName}`);
           window.location.reload();
           setInviteName("")
          }

        useEffect(() => {
            instance.get(`${process.env.REACT_APP_BACK_URL}/auth/me`)
            .then((response) => {
                const intraId = response.data.intraId;
                instance.get(`${process.env.REACT_APP_BACK_URL}/channel/${chIdx}`)
                .then((response) => {
                    if (response.data.ownerId === intraId)
                        setOwner(true);
                    if (response.data.chPwd)
                        setIsPass(true);
                    if (response.data.isPrivate)
                        setIsPrivate(true);
                    setOwnerID(response.data.ownerId);
                })
                .catch((error) => {
                    navigate('/main');
                    alert("채널 없어짐");
                console.error("API 요청 실패:", error);
                });
                // instance.post(`${process.env.REACT_APP_BACK_URL}/channel/private/${chIdx}`)
                // .then((response) => {
                //     setIsPrivate(response.data);
                // })
                // .catch((error) => {
                //     navigate('/main');
                //     alert("채널 없어짐");
                // console.error("API 요청 실패:", error);
                // });

            })
            .catch((error) => {
            console.error("API 요청 실패:", error);
            });


        instance.get(`${process.env.REACT_APP_BACK_URL}/channel/users/${channelIdx}`)
            .then((response) => {
            setUserList(response.data);
            })
            .catch((error) => {
            console.error("API 요청 실패:", error);
            });

            instance.get(`${process.env.REACT_APP_BACK_URL}/channel/ban/${channelIdx}`)
            .then((response) => {
                // console.log(response.data);
            setBanList(response.data);
            })
            .catch((error) => {
            console.error("API 요청 실패:", error);
            });

        socket.on("delete", () => {
            navigate('/main');
            alert("방 폭파됨");
            
        });
            
        socket.on("no-permissions", () => {
            alert("너 권한없음");
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
        socket.on("max-capacity" ,() => {
            alert("채널에 남는 자리가 없어요")
        })

        return () => {
            socket.off("kick");
            socket.off("mute");
            socket.off("ban");
            socket.off("no-permissions")
            socket.off("max-capacity")
            socket.off("delete");
          };

        }, []);

          

    return (
        <div className="channel-admin">
            {/* <span>admin  : {chName}</span> */}
            <AdminUserList userList={userList} banList={banList}/>
            <div className="admin-setting-box">
                <div>
                    <Setting ownerId={ownerId} setting="admin" chIdx={chIdx} userList={userList} banList={banList}  />
                    <Setting ownerId={ownerId} setting="mute" chIdx={chIdx} userList={userList} banList={banList} />
                    <Setting ownerId={ownerId} setting="kick" chIdx={chIdx} userList={userList} banList={banList} />
                    <Setting ownerId={ownerId} setting="ban" chIdx={chIdx} userList={userList} banList={banList} />
                    {/* <Setting setting="invite" chIdx={chIdx} userList={userList} banList={banList} /> */}
                </div>
                <form className="admin-option-box channel-admin-invite" onSubmit={handleInvite}>
                    <h5>초대하기</h5>
                    <input placeholder="닉네임" onChange={onChange} value={inviteName} type="text" autoComplete="off" ></input>
                    <button className="channel-admin-invite-button">{"+"}</button>
                </form>
                { isOwner && !isPrivate && <PassSetting channelIdx={chIdx} channelName={channelName} isPass={isPass} />}
                <button className="admin-setting-back" onClick={handleOnclick}>돌아가기</button>
            </div>
        </div>
    )
}

function AdminUserList({userList, banList} : AdminUserListProps){
      
    return (
        <div className="admin-list-box">
            <div className="admin-user-box">
            <h1>User List</h1>
                {userList.map((info, index) => <UserInfo key={index} intraId={info.intraId} nickName={info.nickName}/>)}
            </div>
            <div className="admin-user-box">
            <h1>Ban List</h1>
                {banList.map((info, index) => <UserInfo key={index} intraId={info.intraId} nickName={info.nickName}/>)}
            </div>
        </div>
    )
}

function Setting({setting, chIdx , userList, ownerId} : SettingInfo ){
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (setting === "admin")
        {
            const targetIntraId = userList.find(user => user.nickName === text);
            if (targetIntraId)
            {
                // instance
                // .post(`${process.env.REACT_APP_BACK_URL}/channel/${chIdx}`, {intraId : targetIntraId, nickName: text})
                // .then((response) => {
                //     console.log(response.data);
                // })
                // .catch((error) => {
                //     console.error("API 요청 실패:", error);
                // });
                // navigate('/main');
                // alert('관리자가 변경되어 main 페이지로 이동합니다.');
                if (targetIntraId.intraId === ownerId)
                {
                    alert("관리자를 건드리지 마시오")
                    setText("");
                    return;
                }
                socket.emit("channel-admin", { chIdx: chIdx, intraId: targetIntraId.intraId });
                alert('실행 완료');
            }
            else
                alert("올바르지 않은 닉네임")
        }
        else if (setting === "mute")
        {
            const targetIntraId = userList.find(user => user.nickName === text);
            if (targetIntraId)
            {
                // instance
                // .post(`${process.env.REACT_APP_BACK_URL}/channel/mute/${chIdx}`, {intraId : targetIntraId, nickName: text})
                // .then((response) => {
                //     console.log(response.data);
                // })
                // .catch((error) => {
                //     console.error("API 요청 실패:", error);
                // });
                if (targetIntraId.intraId === ownerId)
                {
                    alert("관리자를 건드리지 마시오");
                    setText("");
                    return;
                }
                socket.emit("channel-mute", { chIdx: chIdx, intraId: targetIntraId.intraId, nickName: targetIntraId.nickName });
                alert('실행 완료');
            }
            else
                alert("올바르지 않은 닉네임")
        }
        else if (setting === "kick")
        {
            const targetIntraId = userList.find(user => user.nickName === text);
            if (targetIntraId)
            {
                // instance
                // .post(`${process.env.REACT_APP_BACK_URL}/channel/kick/${chIdx}`, {intraId : targetIntraId, nickName: text})
                // .then((response) => {
                //     console.log(response.data);
                // })
                // .catch((error) => {
                //     console.error("API 요청 실패:", error);
                // });
                if (targetIntraId.intraId === ownerId)
                {
                    setText("");
                    alert("관리자를 건드리지 마시오")
                    return;
                }
                socket.emit("channel-kick", { chIdx: chIdx, intraId: targetIntraId.intraId });
                alert('실행 완료');

            }
            else
                alert("올바르지 않은 닉네임")
        }
        else if (setting === "ban")
        {
            const targetIntraId = userList.find(user => user.nickName === text);
            if (targetIntraId)
            {
                // instance
                // .post(`${process.env.REACT_APP_BACK_URL}/channel/ban/save/${chIdx}`, {intraId : targetIntraId, nickName: text})
                // .then((response) => {
                //     console.log(response.data);
                // })
                // .catch((error) => {
                //     console.error("API 요청 실패:", error);
                // });
                // window.location.reload();
                if (targetIntraId.intraId === ownerId)
                {
                    setText("");
                    alert("관리자를 건드리지 마시오")
                    return;
                }
                socket.emit("channel-ban", { chIdx: chIdx, intraId: targetIntraId.intraId });
                alert('실행 완료');
                window.location.reload();
            }
            else
                alert("올바르지 않은 닉네임")
            }
        setText("");
      };

    return (
        <div className="admin-option-box">
            <h5>{setting}</h5>
            <form className="admin-input-form" onSubmit={onSubmit}>
                <input
                    type="text"
                    onChange={onChange} 
                    value={text}
                    name="setting"
                    autoComplete="off"
                    placeholder="닉네임"
                    maxLength={12}
                />
                <button className="admin-input-button">{"+"}</button>
            </form>
        </div>
    )
}

function PassSetting({channelIdx, isPass} : PassSettingProps)
{   
    const [pass, setPass] = useState("");
    const [option, setOption] = useState("");

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // 숫자 이외의 문자 제거
        const filteredValue = value.replace(/\D/g, "");
        setPass(filteredValue);
    };
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        var newPass = "";
        if (option === "modify" || option === "create")
        {
            newPass = pass;
            if (newPass.length !== 4)
            {
                alert("패스워드는 4자리만 가능합니다.");
                return;
            }
        }
        else if (option === "delete")
        {
            console.log(`${pass} ${option}`)
        }
        else return;
        instance
        .patch(`${process.env.REACT_APP_BACK_URL}/channel/${channelIdx}`, {chPwd:pass})
        .then((response) => {
            if (option === "modify" || option === "create")
                alert (`${pass} 로 패스워드 ${option} 성공 `)
            else if (option === "delete")
                alert (`패스워드 삭제 성공`);
        })
        .catch((error) => {
            console.log(error);
        })
        window.location.reload();
        setPass("");
    };
    return <div className="admin-pass-box">
        <h2>채널 비밀번호 설정</h2>
        <form className="admin-pass-form" onSubmit={onSubmit}>
            <input
                placeholder="비밀번호를 입력해주세요."
                type="text"
                onChange={onChange}
                value={pass}
                autoComplete="off"
                maxLength={4}
                />
           {isPass && <button className="chan-admin-modify-button" onClick={() => {setOption("modify")}}> 수정 </button>}
           {!isPass && <button className="chan-admin-create-button" onClick={() => {setOption("create")}}> 생성 </button>}
           {isPass &&<button className="chan-admin-delete-button" onClick={() => {setOption("delete")}}> 삭제 </button>}
        </form>
    </div>
}

function UserInfo({intraId, nickName} : UserInfos){
    return <div className="user-info-box">
        <div className="user-info-intra">{intraId}</div>
        <div className="user-info-nick">{nickName}</div>
    </div>
} 

export default ChannelAdmin;
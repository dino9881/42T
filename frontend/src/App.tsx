import "./App.css";
import axios, { AxiosResponse } from "axios";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "./Login";
import Main from "./main";
import Chat from "./Chat";
import Channel from "./channel/Channel";
import Ranking from "./ranking/Ranking";
import OAuth from "./OAuth";
import Background from "./Background";
import SetNick from "./login/SetNick";
import CheckEmail from "./login/CheckEmail";
import Contents from "./Contents";
import Menu from "./menu/Menu";
import { useState } from "react";
import ChannelAdmin from "./ChannelAdmin";

function App() {
    axios.defaults.withCredentials = true;
    const [channelName, setChannelName] = useState("");

    function channelInit(newChannel : string){
        setChannelName(newChannel);
    }

   

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/login/nick" element={<SetNick />}></Route>
                    <Route path="/login/email" element={<CheckEmail />}></Route>
                    <Route path="/main" element={<Main />}></Route>
                    <Route path="/chat" element={<Contents mainComponent={<Chat channelName={channelName} channelInit={channelInit}/>} headerComponent={<Menu showBackButton={true}/>}/>}></Route>
                    <Route path="/admin" element={<Contents mainComponent={<ChannelAdmin channelName={channelName}/>} headerComponent={<Menu showBackButton={true}/>}/>}></Route>
                    <Route path="/channel" element={<Channel />}></Route>
                    <Route path="/ranking" element={<Ranking />}></Route>
                </Routes>
            <Background />
            </BrowserRouter>
        </div>
    );
}

export default App;

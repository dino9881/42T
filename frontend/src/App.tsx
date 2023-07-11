import "./App.css";
import axios, { AxiosResponse } from "axios";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "./Login";
import Chat from "./chat/Chat";
import Channel from "./channel/Channel";
import Ranking from "./ranking/Ranking";
import OAuth from "./OAuth";
import Background from "./Background";
import SetNick from "./login/SetNick";
import Contents from "./Contents";
import Menu from "./menu/Menu";
import { useState } from "react";
import ChannelAdmin from "./chat/channelAdmin/ChannelAdmin";

function App() {
    axios.defaults.withCredentials = true;
    const [channelName, setChannelName] = useState<string>(() => {
        const storedChName = localStorage.getItem("chName");
        return storedChName || "undefined";
      });
    const [channelIdx, setChannelIdx] = useState<number>(() => {
        const storedchannelIdx = localStorage.getItem("chIdx");
        return storedchannelIdx ? parseInt(storedchannelIdx) : 0;
      });

    function channelInit(newChannel : string, newChannelIdx : number){
        setChannelName(newChannel);
        setChannelIdx(newChannelIdx);
    }

   

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/login/nick" element={<SetNick />}></Route>
                    <Route path="/main" element={<Contents mainComponent={<Channel channelName={channelName} />} headerComponent={<Menu showBackButton={false} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/chat" element={<Contents mainComponent={<Chat channelName={channelName} channelInit={channelInit}/>} headerComponent={<Menu showBackButton={true} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/admin" element={<Contents mainComponent={<ChannelAdmin channelName={channelName} channelIdx={channelIdx}/>} headerComponent={<Menu showBackButton={true} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                    <Route path="/rank" element={<Contents mainComponent={<Ranking/>} headerComponent={<Menu showBackButton={false} channelName={channelName} channelIdx={channelIdx}/>}/>}></Route>
                </Routes>
            <Background />
            </BrowserRouter>
        </div>
    );
}

export default App;
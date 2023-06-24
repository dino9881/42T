import "./App.css";
import axios, { AxiosResponse } from "axios";
import Login from "./Login";
import Main from "./main";
import Chat from "./Chat";
import Channel from "./Channel";
import Ranking from "./ranking/Ranking";
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import OAuth from "./OAuth";
import Background from "./Background";
import { Link } from "react-router-dom";

function App() {
    axios.defaults.withCredentials = true;

   

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/main" element={<Main />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                    <Route path="/channel" element={<Channel />}></Route>
                    <Route path="/ranking" element={<Ranking />}></Route>
                </Routes>
            <Background />
            </BrowserRouter>
        </div>
    );
}

export default App;

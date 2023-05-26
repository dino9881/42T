import "./App.css";
import axios, { AxiosResponse } from "axios";
import Layout from "./Layout";
import Login from "./Login";
import Main from "./main";
import Chat from "./Chat";
import {
    BrowserRouter,
    createBrowserRouter,
    Route,
    RouterProvider,
    Routes,
} from "react-router-dom";
import OAuth from "./OAuth";
import Background from "./Background";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/login" element={<OAuth />}></Route>
                    <Route path="/main" element={<Main />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                </Routes>
            </BrowserRouter>
            <Background />
        </div>
    );
}
export default App;

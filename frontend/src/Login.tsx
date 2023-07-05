import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import setAuthorizationToken from "./setAuthorizationToken";
import { ConnectionState } from "./ConnectionState";
import Timer from "./login/Timer";

function Login() {
    const url =
        "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5f6c11deaba7c5820c30f06b7944c9c1267194355db1c971c9e54b90563b7c5c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code";
    function Oauth() {
        window.location.href = url;
    }

    return (
        <div className="login-box">
            <h1>42트</h1>
            <button className="login-button" onClick={Oauth}>
                42 Login
            </button>
<<<<<<< HEAD
=======
            
            {/* <button onClick={test}>oauth</button>
            <button onClick={test1}>sub</button>
            <button onClick={test2}>sub2</button>
            <button onClick={test3}>sub3</button> */}
>>>>>>> socket-chat
        </div>
    );
}

export default Login;

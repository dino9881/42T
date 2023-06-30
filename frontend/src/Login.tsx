import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import setAuthorizationToken from "./setAuthorizationToken";
import { ConnectionState } from "./ConnectionState";

function Login() {
    const url =
        "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5f6c11deaba7c5820c30f06b7944c9c1267194355db1c971c9e54b90563b7c5c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code";
    function Oauth() {
        window.location.href = url;
    }

    function test() {
        axios
            .post("http://localhost:5001/member/create", {
                intraId: "yyoo",
                nickName: "heeskim",
                avatar: "../public/img/avatar.jpg",
                rank: 100,
            })
            .then((res) => {});
    }
    function test1() {
        axios
            .post("http://localhost:5001/auth/login", { intraId: "yyoo" })
            .then((res) => {
                const token = res.data.access_token;
                console.log(token);
                localStorage.setItem("jwtToken", token);
                setAuthorizationToken(token);
            });
    }

    function test2() {
        axios.get("http://localhost:5001/member/all").then((res) => {
            console.log(res.data);
        });
        // .catch((err) => {
        //     if (err.data.status == 401) {
        //         axios
        //             .post("http://localhost:5001/auth/refresh")
        //             .then((res) => {});
        //     }
        // });
    }
    function test3() {
        axios.post("http://localhost:5001/auth/refresh").then((res) => {
            console.log(res.data);
        });
    }

    return (
        <div className="login-box">
            <h1>42트</h1>
            <button className="login-button" onClick={Oauth}>
                42 Login
            </button>
            
            {/* <button onClick={test}>oauth</button>
            <button onClick={test1}>sub</button>
            <button onClick={test2}>sub2</button>
            <button onClick={test3}>sub3</button> */}
        </div>
    );
}

export default Login;

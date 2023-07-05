import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";
import axios from "axios";
import { response } from "express";
import setAuthorizationToken from "./setAuthorizationToken";

const OAuth: React.FC = () => {
    const location = useLocation();
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });

    const navigate = useNavigate();

    const code = query.code;
    console.log(code);

    axios
        .post("http://localhost:5001/auth/code", { code: code })
        .then(function (response) {
            console.log(response);
            const intraId: string = response.data;
            axios
                .post("http://localhost:5001/auth/login", {
                    intraId: response.data,
                })
                .then((res) => {
                    console.log(res);
                    const token = res.data.access_token;
                    console.log(token);
<<<<<<< HEAD
                    localStorage.setItem("jwtToken", token);
                    setAuthorizationToken(token);
                    navigate("/main");
                })
=======
                    localStorage.setItem("jwtToken", token); // 지금은 access token인데 refresh token으로 바껴야함
                    setAuthorizationToken(token);
                    navigate("/main");
                })
                // navigate("/main");
>>>>>>> socket-chat
                .catch((error) => {
                    console.log(error);
                    if (error.response.status === 404) {
                        navigate("/login/nick", {
                            state: { intraId: intraId },
                        });
                    }
                });
        });

    return (
        <div className="login-box">
            <h1>Loading...</h1>
            {/* 전송해주고 */}
        </div>
    );
};

export default OAuth;

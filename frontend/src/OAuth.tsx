import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";
import axios from "axios";
import instance from "./refreshToken";

const OAuth: React.FC = () => {
	const location = useLocation();
	const query = qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});

	const navigate = useNavigate();

	const code = query.code;
	// console.log(code);

	axios.post("http://localhost:5001/auth/code", { code: code })
		.then(function (response) {
			// console.log(response);
			const intraId: string = response.data;
			axios.post("http://localhost:5001/auth/login", { intraId: response.data, })
				.then((res) => {
					// console.log(res);
					const token = res.data.access_token;
					// console.log(token);
					localStorage.setItem("jwtToken", token); // 지금은 access token인데 refresh token으로 바껴야함
					if (token) {
						instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
					} else {
						delete instance.defaults.headers.common['Authorization'];
					}
					navigate("/main");
				})
				.catch((error) => {
					// console.log(error);
					if (error.response.status === 404) {
						navigate("/login/nick", {
							state: { intraId: intraId },
						});
					}
					if (error.response.status === 401) {
						alert("Intra Login Error!!!")
						navigate("/")
					}
				})
		})
		.catch((error) => {
			if (error.response.status === 401) {
				alert("Intra Login Error!!!")
				navigate("/")
			}
		})

	return (
		<div className="login-box">
			<h1>Loading...</h1>
			{/* 전송해주고 */}
		</div>
	);
};

export default OAuth;

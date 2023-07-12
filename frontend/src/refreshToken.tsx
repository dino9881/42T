import axios from "axios";
import { response } from "express";
import { async, reject } from "q";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
	baseURL: "http://localhost:5001",
});

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('jwtToken');
	config.headers.Authorization = 'Bearer ' + token;
    config.withCredentials = true;

	return config;
});

instance.interceptors.response.use((response) => {
	if (response.status === 404) {
		console.log('404 페이지로 넘어가야 함!');
	  }
  
	  return response;
	},
	async(error) => {
		const original = error.config;
		if (error.response?.status === 401) {
			// if (isTokenExpired()) await tokenRefresh();
			try {
				
				const refresh = await axios.post("http://localhost:5001/auth/refresh");
				console.log(refresh);
				if (refresh.data?.access_token){
					// console.log(response.data.access_token)
					// console.log(error)
                    localStorage.setItem("jwtToken", refresh.data.access_token); // 지금은 access token인데 refresh token으로 바껴야함
					original.headers.Authorization = `Bearer ${refresh.data.access_token}`;
					if (refresh.data.access_token) {
						instance.defaults.headers.common['Authorization'] = `Bearer ${refresh.data.access_token}`;
					} else {
						delete instance.defaults.headers.common['Authorization'];
					}
					const response = await instance(original);
					console.log(response);
					return response;
				}
			}catch(error){
				window.location.href = "http://localhost:3000";
				console.log("333")
				return error;
			}
		}
	}

	// async (error) => {
	// 	if (error.response?.status === 401) {
	// 	  if (isTokenExpired()) await tokenRefresh();
	
	// 	  const accessToken = getToken();
	
	// 	  error.config.headers = {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${accessToken}`,
	// 	  };
	
	// 	  const response = await axios.request(error.config);
	// 	  return response;
	// 	}
	// 	return Promise.reject(error);
	//   }
)

export default instance
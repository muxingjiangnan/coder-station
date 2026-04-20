import axios from "axios";
import { message } from "antd";

const service = axios.create({
	timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use((config) => {
	const token = localStorage.getItem("userToken");
	if (token) {
		config.headers["Authorization"] = "Bearer " + token;
	}
	return config;
});

// 响应拦截器
service.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response) {
			const { status } = error.response;
			if (status === 401) {
				// token 过期或无效，提示用户后清除并刷新
				message.warning("登录已过期，请重新登录");
				localStorage.removeItem("userToken");
				setTimeout(() => {
					window.location.reload();
				}, 800);
			}
		}
		return Promise.reject(error);
	}
);

export default service;

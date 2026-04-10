import axios from "axios";

const service = axios.create({
    timeout:5000,
});

// 请求拦截器
service.interceptors.request.use((config)=>{
    // 拦截请求后，可以做很多处理
    // 一般是添加token
    const token = localStorage.getItem("userToken");
    if(token){
        config.headers["Authorization"] = "Bearer " + token;
    }
    // 请求放行

    return config;

});

// 响应拦截器
service.interceptors.response.use((response)=>{
    // 处理响应数据
    return response.data;
});

export default service;
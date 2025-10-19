import axios from "axios";
import { getCookie } from "./cookie";
const service = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://zcfw.hzsteel.com/api",
  timeout: 15000, //超时15秒
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const info = getCookie();
    if (info) {
      console.log(info);
      if (info.token) {
        config.headers.Authorization = "Bearer " + info.token;
      }
    }
    // console.log(1111)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // return Promise.reject(error);
     const config = error.config;
     if (!config || config._retryCount >= 2) return Promise.reject(error);
     config._retryCount = config._retryCount ? config._retryCount + 1 : 1;
     console.warn(`Retrying request: ${config.url}, attempt ${config._retryCount}`);
     if (config.method === 'get' && error.response && [408, 502, 503, 504].includes(error.response.status)) {
       return new Promise(resolve => setTimeout(() => resolve(service(config)), 1000));
     }
     
     return Promise.reject(error);
  }
);

export default service;

import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://backend.clouddrop.pro/api",
    withCredentials:true,
})
import axios from "axios";
import {updateToken} from "../App";

export const server = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

server.interceptors.request.use(async (config) => {
    const currentToken = () => `Bearer ${localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN)}`;

    const checkStatus = (expected, status) => {
        if (status !== expected) throw Error("Unauthorized")
    };

    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            {
                withCredentials: true,
                headers: {Authorization: currentToken()}
            }
        )

        const {status, data: {access_token}} = response;
        checkStatus(200, status);

        localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN, access_token);
        updateToken(access_token);
        config.headers.Authorization = currentToken();
        return config
    } catch (e) {
        return Promise.reject(e);
    }
});

export const authApi = {
    login(credentials) {
        return axios.post(
            `${process.env.REACT_APP_API_URL}/auth/login`,
            {credentials},
            {withCredentials: true}
        )
    },
};

import axios from "axios";

const apiRequest = axios.create({
    baseURL: "http://localhost:8800/api",
    withCredentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

export default apiRequest;


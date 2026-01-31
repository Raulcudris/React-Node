import axios from "axios";

const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

export default apiRequest;


import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter)


app.listen(8800,()=>{
    console.log('Server is running');
});
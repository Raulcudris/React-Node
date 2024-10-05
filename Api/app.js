import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';
import postRouter from './routes/post.route.js';
import testRouter from './routes/test.route.js';
import userRouter from './routes/user.route.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter)
app.use("/api/test",testRouter);
app.use("/api/users",userRouter );
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);



app.listen(8800,()=>{
    console.log('Server is running');
});
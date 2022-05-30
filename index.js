const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('config');
const PORT = config.get('serverPort');
const corsMiddleware = require('./middleware/cors.middleware');

const app = express();

const usersRouter = require('./users/users.routes');
const authRouter = require('./auth/auth.routes');
const postsRouter = require('./posts/posts.routes');
const reactionsRouter = require('./reactions/reactions.routes');
const commentsRouter = require('./comments/comments.routes');
const meetingsRouter = require('./meetings/meetings.routes');
const socketServer = require('./socketServer');

app.use(corsMiddleware);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/public', express.static('public'));

app.use('/v1/auth', authRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/posts', postsRouter);
app.use('/v1/reactions', reactionsRouter);
app.use('/v1/comments', commentsRouter);
app.use('/v1/meetings', meetingsRouter);

const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socketServer(socket);
});

const start = async () => {
  try {
    await mongoose.connect(config.get('dbURL'), {});
    http.listen(PORT, () => {
      console.log('server started on port', PORT);
    });
  } catch (e) {
    console.error(e);
  }
};

start();

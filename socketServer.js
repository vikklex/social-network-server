const users = [];

const socketServer = (socket) => {
  socket.on('joinUser', (id) => {
    users.push({ id, socketId: socket.id });
  });

  socket.on('disconnect', () => {
    const user = users.filter((user) => user.socketId !== socket.id);
  });

  socket.on('like', (post) => {
    const id = post.userId;

    const client = users.filter((user) => id === user.id);

    console.log(users, id);
  });

  socket.on('dislike', (post) => {
    console.log({ post });
  });
};

module.exports = socketServer;

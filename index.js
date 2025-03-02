const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
  cors: {
    origin: '<http://localhost:3000>',
  },
});

// app.use(cors());
let interval = null;
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('pong', (data) => {
    console.log(`⚡:  user sent=>`, data);

    socket.emit('ping', { data: 'received' });
  });

  socket.on('livelogs', () => {
    console.log(`⚡:  user needs live logs=>`);

    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      socket.emit('updatelogs', { data: 'received', id: new Date() });
    }, 5000);
    socket.emit('updatelogs', { data: 'received', id: new Date() });
  });

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

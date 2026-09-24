const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

let users = {};

io.on('connection', (socket) => {
    socket.on('user-online', (userData) => {
        users[socket.id] = { name: userData.name, phone: userData.phone };
        io.emit('update-users', Object.values(users));
    });

    socket.on('send-message', (data) => {
        socket.broadcast.emit('receive-message', data);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('update-users', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Сервер працює на порту ' + PORT));

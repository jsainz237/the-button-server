import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import { SocketEvent } from './types/events';
// import { database } from './database';

const PORT = process.env.port || 5000;

// new express application instance
const app: express.Application = express();
const server = new http.Server(app);
const io = socketio(server);

io.on('connection', socket => {
    socket.on(SocketEvent.PRESSED, () => {
        io.emit(SocketEvent.RESET)
    })
})


server.listen(PORT, function() {
    console.log(`The button server listening on port ${PORT}`)
})
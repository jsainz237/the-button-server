import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import { SocketEvent } from './types/events';
import { database } from './database';
// import { database } from './database';

const port = process.env.PORT || 5000;

// new express application instance
const app: express.Application = express();
const server = new http.Server(app);
const io = socketio(server);

// sync Database with model declarations
const forceSyncDB = process.env.npm_config_create_db ? true : false; // force create db if --create_db flag was set
database.sync({ force: forceSyncDB });

io.on('connection', socket => {
    socket.on(SocketEvent.PRESSED, () => {
        io.emit(SocketEvent.RESET)
    })
})


server.listen(port, function() {
    console.log(`The button server listening on port ${port}`)
})
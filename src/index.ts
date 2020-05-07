import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import bodyParser from 'body-parser';

import { SocketEvent } from './types/events';
import { database } from './database';
import registerRoutes from './routes/register';
import loginRoutes from './routes/login';
import { on_pressed_event } from './socket/pressed';
import { Rank } from './types/ranks';
import { colorState } from './colorState';

const port = process.env.PORT || 5000;

// state object for storing current color of the button
export let state: { currentColor: Rank } = {
    currentColor: Rank.GRAY
}

// new express application instance
const app: express.Application = express();
const server = new http.Server(app);
export const io = socketio(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// sync Database with model declarations
const forceSyncDB = process.env.npm_config_create_db ? true : false; // force create db if --create_db flag was set
database.sync({ force: forceSyncDB });

// REST routes
app.use('/auth/register/', registerRoutes);
app.use('/auth/login', loginRoutes);

io.on('connect', socket => {
    console.log('client connected');
    socket.emit(SocketEvent.UPDATE_COLOR, { color: colorState.color, index: colorState.index });
    socket.on(SocketEvent.PRESSED, (user_id?: string) => on_pressed_event(io, user_id))
})


server.listen(port, function() {
    console.log(`The button server listening on port ${port}`)
})
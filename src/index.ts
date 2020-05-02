import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';

import { SocketEvent } from './types/events';
import { database } from './database';
import User from './models/user';
import registerRoutes from './routes/register';
// import { database } from './database';

const port = process.env.PORT || 5000;

// new express application instance
const app: express.Application = express();
const server = new http.Server(app);
const io = socketio(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// sync Database with model declarations
const forceSyncDB = process.env.npm_config_create_db ? true : false; // force create db if --create_db flag was set
database.sync({ force: forceSyncDB });

// REST routes
app.use('/auth/register/', registerRoutes);

io.on('connect', socket => {
    console.log("client connected");
    socket.on(SocketEvent.PRESSED, async (user_id: string) => {
        console.log("button pressed");
        const user = user_id ? 
            await User.findOne({
                where: {
                    id: user_id
                }
            }) :
            null;

        const username = user?.username || `anon-${uuidv4().slice(-5)}`;
        console.log(username);
        io.emit(SocketEvent.RESET, username);
    })
})


server.listen(port, function() {
    console.log(`The button server listening on port ${port}`)
})
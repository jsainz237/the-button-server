import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
// import cookieParser from 'cookie-parser';

import { SocketEvent } from './types/events';
import { database } from './database';
import registerRoutes from './routes/register';
import loginRoutes from './routes/login';
import checkUsernameRoutes from './routes/checkUsername';
import { onPressedEvent } from './socket/pressed';
import { Rank } from './types/ranks';
import { colorState } from './colorState';
// import { checkCookie } from './utils/cookies';

const port = process.env.PORT || 5000;

// state object for storing current color of the button
export let state: { currentColor: Rank } = {
    currentColor: Rank.GRAY
}

const corsOptions: cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false, /** @todo set to true for credentials */
    methods: "GET,POST",
    origin: process.env['WEBSITE_URL'] || 'http://localhost:4200',
    preflightContinue: false
};

// new express application instance
const app: express.Application = express();
const server = new http.Server(app);
export const io = socketio(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// configure cors
app.use(cors(corsOptions));

// parse cookie
// app.use(cookieParser());

// sync Database with model declarations
const forceSyncDB = process.env.npm_config_create_db ? true : false; // force create db if --create_db flag was set
database.sync({ force: forceSyncDB });

// REST routes
app.use('/auth/register', registerRoutes);
app.use('/auth/login', loginRoutes);
app.use('/auth/check-username', checkUsernameRoutes);

// Socket connections & events
io.on('connect', socket => {
    // checkCookie(socket);
    console.log('client connected');
    if(colorState.isDead) { 
        socket.emit(SocketEvent.DEATH)
        return;
    }
    socket.emit(SocketEvent.UPDATE_COLOR, { color: colorState.color, index: colorState.index });
    socket.on(SocketEvent.PRESSED, (user_id?: string) => onPressedEvent(user_id));
})


server.listen(port, function() {
    console.log(`The button server listening on port ${port}`)
})
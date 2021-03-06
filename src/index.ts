import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

import { SocketEvent } from './types/events';
import { database } from './database';
import authRoutes from './routes/auth';
import { onPressedEvent } from './socket/pressed';
import { Rank } from './types/ranks';
import { colorState } from './types/colorState';

const port = process.env.PORT || 5000;

// state object for storing current color of the button
export let state: { currentColor: Rank } = {
    currentColor: Rank.GRAY
}

const corsOptions: cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    origin: process.env['WEB_ORIGIN'],
    preflightContinue: false
};

// new express application instance
const app: express.Application = express();
const server = new http.Server(app);
export const io = socketio(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// configure cors
app.use(cors(corsOptions));

//JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header
const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://dev-k3li5q0q.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'http://localhost:5000',
    issuer: 'https://dev-k3li5q0q.auth0.com/',
    algorithms: ['RS256']
});

// sync Database with model declarations
const forceSyncDB = process.env.npm_config_create_db ? true : false; // force create db if --create_db flag was set
database.sync({ force: forceSyncDB });

// REST routes
app.use('/auth', authCheck, authRoutes);

// Socket connections & events
let clientList: SocketIO.Socket[] = [];
io.on('connect', socket => {
    clientList.push(socket);
    console.log(`\nclient ${socket.id} connected`);
    console.info(`current client count: ${clientList.length}`);
    
    if(colorState.isDead) { 
        socket.emit(SocketEvent.DEATH)
        return;
    } 
    else if(clientList.length === 1) {
        colorState.timer.resume();
    }

    socket.emit(SocketEvent.SEND_FEED, { feed: colorState.feed });
    socket.emit(SocketEvent.UPDATE_COLOR, { color: colorState.color, index: colorState.index });
    socket.on(SocketEvent.PRESSED, (email?: string) => onPressedEvent(socket, email));
    
    socket.on('disconnect', () => {
        const socketIndex = clientList.indexOf(socket);
        clientList.splice(socketIndex, 1);
        console.log(`\nclient ${socket.id} disconnected`);
        console.info(`current client count: ${clientList.length}`);

        if(clientList.length === 0) {
            colorState.timer.pause();
        }
    })
})

server.listen(port, function() {
    console.log(`The button server listening on port ${port}`)
})
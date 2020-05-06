import { v4 as uuidv4 } from 'uuid';
import User from "../models/user";
import { SocketEvent } from '../types/events';

export async function on_pressed_event(io: SocketIO.Server, user_id?: string) {
    const user = user_id ?
        await User.findOne({
            where: { id: user_id }
        }) :
        null;

    const username = user?.username || `Anon-${uuidv4().slice(-5)}`;
    io.emit(SocketEvent.RESET, username)
}
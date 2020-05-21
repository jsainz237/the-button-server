import { v4 as uuidv4 } from 'uuid';
import { io } from '../index';
import { colorState } from '../colorState';
import User from "../models/user";
import { SocketEvent } from '../types/events';

export async function onPressedEvent(user_id?: string) {
    const user = user_id ?
        await User.findOne({
            where: { id: user_id }
        }) :
        null;

    const displayname = user?.displayname || `Anon-${uuidv4().slice(-5)}`;
    colorState.reset();
    io.emit(SocketEvent.RESET, displayname)
}
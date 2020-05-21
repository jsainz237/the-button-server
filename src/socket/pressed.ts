import { v4 as uuidv4 } from 'uuid';
import { colorState } from '../colorState';
import User from "../models/user";
import { SocketEvent } from '../types/events';

export async function onPressedEvent(socket: SocketIO.Socket, email?: string) {
    let user: User | null = null;
    const current_color = colorState.color;

    // if user email is sent with event, update user's rank with current color
    if(email) {
        user = await User.findOne({ where: { email }});
        user?.update({ rank: current_color });
    }

    const displayname = user?.displayname || `Anon-${uuidv4().slice(-5)}`;
    
    colorState.reset(displayname);
    socket.emit(SocketEvent.SET_USER_COLOR, { rank: current_color });
}
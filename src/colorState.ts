import { Rank } from "./types/ranks";
import { io } from './index';
import { SocketEvent } from "./types/events";

// should be static cause there will only be 1 instance of
class ColorState {
    public color: Rank = Rank.GRAY;
    private index: number = 0;
    private timer: number | undefined;

    private colorMapping: Rank[] = [
        Rank.GRAY, 
        Rank.PURPLE, Rank.PURPLE, Rank.PURPLE,
        Rank.BLUE, Rank.BLUE,
        Rank.GREEN, Rank.GREEN,
        Rank.YELLOW, Rank.YELLOW,
        Rank.ORANGE, Rank.ORANGE,
        Rank.RED
    ];
    
    private startTimer() {
        const countdown_days = Math.floor(Math.random() * 9) + 2;
        //const countdown_milliseconds = countdown_days * 86400000;
        const countdown_milliseconds = countdown_days * 10000;
        const countdown_interval = countdown_milliseconds / this.colorMapping.length;

        this.timer = window.setInterval(() => this.nextColor(), countdown_interval);
    }

    private nextColor() {
        if(this.index === this.colorMapping.length) {
            window.clearInterval(this.timer);
            return io.emit(SocketEvent.DEATH);
        }
        this.index += 1;
        this.color = this.colorMapping[this.index];
        return io.emit(SocketEvent.UPDATE_COLOR, this.color, this.index);
    }

    public reset(username?: string) {
        io.emit(SocketEvent.RESET, username);
        io.emit(SocketEvent.UPDATE_COLOR, Rank.GRAY);
        window.clearInterval(this.timer);
        this.index = 0;
        this.startTimer();
    }
}

export const colorState = new ColorState();
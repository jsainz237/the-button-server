import { Rank } from "./types/ranks";
import { io } from './index';
import { SocketEvent } from "./types/events";

class ColorState {
    public color: Rank = Rank.GRAY;
    public index: number = 0;
    public isDead: boolean = false;
    private timer: any; // needs to be any cause typescript complains about Timeout vs number

    constructor() {
        this.startTimer();
    }

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
        const countdown_milliseconds = countdown_days * 86400000; // days
        //const countdown_milliseconds = countdown_days * 10000; // mins
        const countdown_interval = countdown_milliseconds / this.colorMapping.length;

        this.timer = setInterval(() => this.nextColor(), countdown_interval);
    }

    private nextColor() {
        if(this.index === this.colorMapping.length - 1) {
            clearInterval(this.timer);
            this.isDead = true;
            return io.emit(SocketEvent.DEATH);
        }
        this.index += 1;
        this.color = this.colorMapping[this.index];
        return io.emit(SocketEvent.UPDATE_COLOR, { color: this.color, index: this.index });
    }

    public reset(displayname?: string) {
        io.emit(SocketEvent.RESET, displayname);
        io.emit(SocketEvent.UPDATE_COLOR, { color: Rank.GRAY, index: 0 });
        clearInterval(this.timer);
        this.index = 0;
        this.startTimer();
    }
}

export const colorState = new ColorState();
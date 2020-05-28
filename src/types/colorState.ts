import { Rank } from "./ranks";
import { io } from '../index';
import { SocketEvent } from "./events";
import { IntervalTimer } from './timer';

const MAX_FEED_LENGTH = 3;

interface FeedItem {
    displayname: string;
    rank: Rank;
}

class ColorState {
    public color: Rank = Rank.GRAY;
    public index: number = 0;
    public isDead: boolean = false;
    public feed: FeedItem[] = [];

    public timer: IntervalTimer;
    // private timer: any; // needs to be any cause typescript complains about Timeout vs number

    constructor() {
        this.timer = new IntervalTimer(() => this.nextColor(), this.getRandomInterval());
        this.timer.pause();
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

    private getRandomInterval(): number {
        let countdown = Math.floor(Math.random() * 45) + 45; // 45 - 90 mins
        countdown *= 1000; // 60000 ms / min

        return countdown / this.colorMapping.length;
    }

    /** go to next color, or if button is dead, send death event */
    private nextColor() {
        if(this.index === this.colorMapping.length - 1) {
            delete this.timer;
            this.isDead = true;
            return io.emit(SocketEvent.DEATH);
        }

        this.index += 1;
        this.color = this.colorMapping[this.index];
        return io.emit(SocketEvent.UPDATE_COLOR, { color: this.color, index: this.index });
    }

    /** reset timer and color */
    public reset(displayname: string) {        
        this.addToFeed({ displayname, rank: this.color })

        io.emit(SocketEvent.RESET, { feed: this.feed });
        io.emit(SocketEvent.UPDATE_COLOR, { color: Rank.GRAY, index: 0 });

        this.index = 0;
        this.color = Rank.GRAY;
        this.timer.restart(this.getRandomInterval());
    }

    /** add event to activity feed */
    private addToFeed(feedItem: FeedItem) {
        if(this.feed.length === MAX_FEED_LENGTH)
            this.feed.pop();

        this.feed.unshift(feedItem);
    }
}

export const colorState = new ColorState();
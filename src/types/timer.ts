export class IntervalTimer {
    private timerId: any;
    private start: any;
    private remaining: number;
    private intervalDelay: number;
    private callbackFn: () => any;

    constructor(callback: () => any, delay: number) {
        this.callbackFn = callback;
        this.remaining = delay;
        this.intervalDelay = delay;
        this.restart();
    }

    public pause() {
        clearInterval(this.timerId);
        this.remaining -= Date.now() - this.start;
    }

    public resume() {
        this.start = Date.now();
        clearInterval(this.timerId);
        this.timerId = setTimeout(() => {
            this.callbackFn();
            this.restart();
        }, this.remaining);
    }

    public restart(newInterval?: number) {
        clearTimeout(this.timerId);
        this.start = Date.now();

        if(newInterval) {
            this.intervalDelay = newInterval;
        }

        this.remaining = this.intervalDelay;
        this.timerId = setInterval(this.callbackFn, this.remaining);
    }
}
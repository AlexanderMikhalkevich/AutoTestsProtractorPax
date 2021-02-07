class Timer {
    private startTime : Date;
    private endTime : Date;

    start() : void {
        this.clear();
        this.startTime = new Date();
    }

    stop() : void {
        if (!this.startTime)
            throw new Error('The timer is not started yet');

        this.endTime = new Date();
    }

    getTime() : number {
        if (!this.startTime)
            throw new Error('The timer is not started yet');

        if (!this.endTime)
            return Date.now() - this.startTime.getTime();

        return this.endTime.getTime() - this.startTime.getTime();
    }

    clear() : void {
        this.startTime = null;
        this.endTime = null;
    }
}

export default Timer;
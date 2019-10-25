class Timer {
    constructor(span) {
        this.span = span;
        this.is_running = false;
        this.start_time = null;
        this.end_time = null;
        this.id = null;
        this.time_elapsed = "0:0";
    }

    start() {
        if (!this.is_running) {
            this.start_time = new Date();
            this.end_time = this.start_time;
            self = this;
            this.span.innerText = this.time_elapsed;
            this.id = window.setInterval(function () {
                self.end_time = new Date();
                let timeDiff = self.end_time - self.start_time;
                timeDiff /= 1000;
                let seconds = Math.round(timeDiff % 60);
                timeDiff = Math.floor(timeDiff / 60);
                let minutes = Math.round(timeDiff % 60);
                self.time_elapsed = minutes + ":" + seconds;
                self.span.innerText = self.time_elapsed;
            }, 1000);
            this.is_running = true;
        }
    };

    stop() {
        if (this.is_running) {
            clearInterval(this.id);
            this.is_running = false;
            this.time_elapsed = "0:0";
        }
    }
}

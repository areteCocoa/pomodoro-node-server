// pomo.js
//
// This file defines the Pomodoro object and all of it's methods, as well as default
// work and rest times.

// Start, paused and stop constants
const POMODORO_STARTED = "started";
const POMODORO_PAUSED = "paused";
const POMODORO_STOPPED = "stopped";

// Work and rest phase constants
const POMODORO_WORK = "work";
const POMODORO_REST = "rest";

// The default times, in milliseconds (ms) (minutes * seconds * milliseconds)
const DEFAULT_WORK_TIME = 25 * 60 * 1000;
const DEFAULT_REST_TIME = 5 * 60 * 1000;

// The Pomodoro class can be used to time in repeated work/break timers, configurable on
// the different durations.
module.exports = class Pomodoro {
    // ---------------------------------------
    // Constructor and object method overrides
    // ---------------------------------------
    constructor() {
        this.work_time = DEFAULT_WORK_TIME;
        this.rest_time = DEFAULT_REST_TIME;
        this.last_update = Date.now();
        this.finish_time = null;
        this.__completed = false;
        this.remaining = 0;
        this.__status = POMODORO_STOPPED;
        this.phase = POMODORO_WORK;

        // Reset the timer by default
        this.reset();
    }

    // -----------------------------
    // Convenience/Interface methods
    // -----------------------------

    // Starts the timer
    start() {
        this.status = POMODORO_STARTED;
    }

    // Pauses the timer
    pause() {
        this.status = POMODORO_PAUSED;
    }

    // Stops the timer
    stop() {
        this.status = POMODORO_STOPPED;
    }

    // Resets the timer, moving back to the beginning of the current cycle
    reset() {
        this.last_update = Date.now();
        this.remaining = DEFAULT_WORK_TIME;
    }

    // ------------------------------
    // Getters, Setters and Modifiers
    // ------------------------------

    get response_dict() {
        var res = {};

        for (var k in this) {
            var v = this[k];
            if (k[0] == "_") {
                let new_k = k.slice(2);
                res[new_k] = this[k];
            } else {
                res[k] = this[k];
            }
        }

        return res;
    }

    get completed() {
        return this.__completed;
    }

    set completed(c) {
        if (this.__completed == c) {
            return;
        }

        // Swap the phase if we're going from not completed to completed, otherwise
        // just change the internal value
        if (c) {
            if (this.phase == POMODORO_WORK) {
                this.phase = POMODORO_REST;
            } else {
                this.phase = POMODORO_WORK;
            }
        }

        this.__completed = c;

    }

    get status() {
        return this.__status;
    }

    // Sets the status and deals with (creates) all side effects. For example, if you
    // use this method to set the status to "started," the timer will start counting
    // downward.
    set status(new_status) {
        if (this.status == new_status) {
            return;
        }

        // Side effects
        if (new_status == "stopped") {
            // We're stopping, we can reset the timer
            this.reset();
        } else if (new_status == "paused" && this.status == "started") {
            // We're going to paused from being started, we can update the last_update
            // to now.
            this.increment();
        } else if (new_status == POMODORO_STARTED && (this.status == POMODORO_PAUSED ||
                                                      this.status == POMODORO_STOPPED)) {
            // We're going to start from being paused or stopped, we move last_update
            // to now so it does not get incremented for the time it was paused.
            this.last_update = Date.now();
            this.finish_time = this.last_update + this.remaining;
        }

        this.__status = new_status;
    }

    // Increments the remaining time from the last time it was called. Call this if you
    // need an updated version of the remaining time. This method is safe to call regardless
    // of state, as it checks state before applying any changes.
    increment() {
        // Don't update anything if we're paused
        if (this.status == POMODORO_STOPPED || this.status == POMODORO_PAUSED) {
            return;
        }

        // Get the current date (time), calculate the difference, and update all the
        // concerned variables
        let now = Date.now();
        let diff = now - this.last_update;
        this.last_update = now;
        this.remaining = this.remaining - diff;

        // Don't let remaining time get below 0, and set it to 0 if it does.
        if (this.remaining <= 0) {
            this.status = POMODORO_STOPPED;
            this.completed = true;
        }
    }
}

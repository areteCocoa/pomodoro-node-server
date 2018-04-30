// main.js
//
// DOCUMENTATION:
//
// http package
// https://nodejs.org/api/http.html
//
// url package
// https://nodejs.org/api/url.html
//
// JS String documentation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
//
// Timers
// https://nodejs.org/en/docs/guides/timers-in-node/
// https://nodejs.org/api/timers.html

// Require packages
const http = require('http');
const url = require('url');

// Server information constants
const hostname = '127.0.0.1';
const port = 3000;

// COMMENTED OUT FOR DEBUGGING
// Default work time is 25 minutes
// const default_work_time = 1500;
// Default rest time is 5 minutes
// const default_rest_time = 300;

// DEBUGGING CONSTANTS
const default_work_time = 10;
const default_rest_time = 2;

// -------------------
// The Pomodoro object
// -------------------

// Create the pomodoro object
let pomo = {
    // Starts the interval object, does nothing if it's already
    // on.
    start : function () {
        this.set_status("started");
    },

    pause : function () {
        this.set_status("paused");
    },

    stop : function () {
        this.set_status("stopped");
    },

    // Toggles the PD object on/off
    toggle : function () {
        if (this.status == "paused" || this.status =="stopped") {
            this.set_status("started");
        } else {
            this.set_status("paused");
        }
    },

    reset : function () {
        this.last_update = Date.now();
        this.remaining = default_work_time * 1000;
    },

    // Sets the status to the new status and updates the remaining time if necessary
    set_status : function (new_status) {
        // Leave early if we're already at the state
        if (this.status == new_status) {
            return;
        }

        // We're stopping, we can reset the timer
        if (new_status == "stopped") {
            this.reset();
        }

        // We're pausing from being started, we can update the last_update to now
        if (this.status == "started" && new_status == "paused") {
            this.increment();
        }

        // We're starting from being paused or stopped, we move last_update to Date.now()
        if ((this.status == "paused" || this.status == "stopped") && new_status == "started") {
            this.last_update = Date.now();

            // Calculate the new finish time
            this.finish_time = this.last_update + this.remaining;
        }

        this.status = new_status;
    },

    // Increments the difference between this.last_update and Date.now()
    //
    // Call this when you want to update the time remaining, especially when
    // pausing the timer.
    increment : function() {
        if (this.status == "stopped" || this.status == "paused") {
            return;
        }
        let now = Date.now();
        let diff = now - this.last_update;
        console.log("Found a difference of " + diff + "ms");

        this.last_update = now;
        this.remaining = this.remaining - diff;

        if (this.remaining <= 0) {
            this.set_status("stopped");
            this.completed = true;
        }
    },

    // Instance Fields/Properties

    // The number of seconds worked before ending the timer
    work_time : default_work_time,

    // The number of seconds rested before restarting the timer
    rest_time : default_rest_time,

    // The last time the timer was updated
    last_update : Date.now(),

    // The time in ms at which the timer will finish
    finish_time : null,

    completed : false,

    // The remaining time in milliseconds
    remaining: 0,

    // The current status of the timer
    status : "stopped"
};

pomo.reset();

// -------------------
// Server Handler Code
// -------------------

// Handle a request and appropriately handle the response
function handle(request, response) {
    // Parse the url, get the command and query value
    parsed_url = url.parse(request.url, true);
    command = get_command(parsed_url);
    q_value = get_query_value(parsed_url);

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");

    if (command != null) {
        // Do something with the command
        switch (command) {
        case "start":
            pomo.start();
            break;
        case "toggle":
            pomo.toggle();
            break;
        };
    }

    pomo.increment();
    response.end(JSON.stringify(pomo));
};

// Returns the command from the parsed_url. Returns null if there
// is not one.
function get_command(parsed_url) {
    path = parsed_url.pathname;
    command = path.split('/')[1];
    if (command == '') {
        return null;
    }
    return command;
};

// Returns the query from the parsed_url. Returns null if there is
// not one.
function get_query_value(parsed_url) {
    search = parsed_url.search;
    if (search != null && search.length > 1) {
        return search.split("?")[1];
    }
    return null;
};

const server = http.createServer(handle);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

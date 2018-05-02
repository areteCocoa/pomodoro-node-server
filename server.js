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

// The Pomodoro object
let Pomodoro = require('./pomodoro');
pomo = new Pomodoro();

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
    response.setHeader("Content-Type", "application/json");

    if (command != null) {
        // Do something with the command
        switch (command) {
        case "start":
            pomo.start();
            break;
        case "pause":
            pomo.pause();
            break;
        case "stop":
            pomo.stop();
            break;
        };
    }

    // Increment at the last possible moment
    pomo.increment();

    // Instantiate a response dictionary that doesn't have "private" (pomo.__private) fields
    r_pomo = pomo.response_dict;

    response.end(JSON.stringify(r_pomo));
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

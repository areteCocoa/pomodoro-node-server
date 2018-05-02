// client.js

let http = require('http');
var keypress = require('keypress');
var sprintf = require('sprintf-js').sprintf;
var titleCase = require('title-case');

let HOST = "localhost";
let PORT = "3000";

let URL = "http://" + HOST + ":" + PORT + "/";

// console.log("=============================\n" +
//             "==== POMODORO CLI CLIENT ====\n" +
//             "====     VERSION 0.1     ====\n" +
//             "=============================\n"
//            );

function handle(data) {
    console.log(titleCase(data["status"]));
    let t_remaining_seconds = data["remaining"] / 1000;
    let remaining_minutes = t_remaining_seconds / 60;
    let remaining_seconds = t_remaining_seconds % 60;

    let phase = data["phase"];
    var t_time;
    if (phase == "work") {
        t_time = data["work_time"];
    } else if (phase == "rest") {
        t_time = data["rest_time"];
    } else {
        console.log("Warning: unrecongized \"phase\" value!");
    }
    let t_seconds = t_time / 1000;
    let t_minutes = t_seconds / 60;
    t_seconds = t_time % 60;

    console.log(sprintf("%02d:%02d / %02d:%02d",
                        remaining_minutes, remaining_seconds,
                        t_minutes, t_seconds
                       ));
}

function handle_response(res) {
    // Validate the response
    let valid_error = validate_response(res);
    if (valid_error) {
        console.error(valid_error.message);
        res.resume();
        return;
    }

    // Parse the response
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            handle(parsedData);
        } catch (e) {
            console.error(e.message);
        }
    });
};

function validate_response(res) {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
    }
    return error;
}

let error_handler = function(e) {
    console.log(e);
};

// Figure out if the user wants to do something
const optionDefinitions = [
    { name: 'action', alias: 'a', type: String, defaultOption: true },
];

const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);
const action = options["action"];
const actions = ["start", "pause", "stop"];

if (action !== null) {
    if (actions.indexOf(action) != -1) {
        URL = URL + action;
    }
}

var request = http.get(URL, handle_response);
request.on('error', error_handler);



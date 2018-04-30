// timer-test.js

var start = Date.now();
function passed(start) {
    return Date.now() - start;
};

function print_passed() {
    console.log("s passed: " + Math.floor(passed(start) / 1000));
};

tmo = setInterval(print_passed, 1000);

# Pomorodo NodeJS Server
Pomorodo NodeJS Server (PNS) is a web server used to localize a pomodoro timer, which
should be utilized using a front-end client.

## The Pomodoro Method
Go look it up. It'll make you good at doing work fast.

## How it Works
PNS runs on a server or your local machine and tracks a pomodoro timer. It utilizes different
URL endpoints to control and interact with the timer, which a front-end client should utilize.

The objective is to allow the user to track their work progress on many different mediums in 
a synchronized manner by automating the time tracking aspect of a pomodoro timer.

# Future Directions/TODO
This project is very young, but it is worth outlining where it should go so anyone who wants
to contribute has an idea of what needs to get done, as well as notifies those interested in
possibly watching this for when it becomes usable.

Last Updated: 4-30-18

## Soon
These features are currently being worked on or need to be worked on.

### Configuration
The server needs to be configured for default times, as well as have the option to change
default user wait and start times.

### Default Client
A default client, probably CLI, needs to be implemented that utilizes communication with
the server. This client should show how the service is supposed to be used.

## Distant Future
These are features we want to implement, but likely not anytime soon.

### Multiple Users and Authentication
One goal is to implement multiple users so there is one server for many users. This is currently
not a focus as most people who would use it in this stage also understand how to start and deploy
a server.

### Push Notifications
HTTP2 (?) allows for push notifications, which is perfect for a timer. This may be something that
needs to be implemented in the future, but it is too difficult for the curretn prototype.

# Server Documentation
## Data Format
(TODO)

## Endpoints
Different web endpoints trigger different controls over the server.

## /
Home - returns the current timer object in JSON format

## /start
Start - Starts the timer. Does nothing if it is already running.

## /pause
Pause - Pauses the timer. Does nothing if it is already paused.

## /stop
Stop - Stops and resets the timer. Similar to pause, but it resets the timer
back to the time.

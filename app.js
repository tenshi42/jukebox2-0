
'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(path.join(__dirname, req.url)) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send("yoooo");
    ws.on('close', () => console.log('Client disconnected'));

});

setInterval(() => {
    wss.clients.forEach((client) => {
        var msg = {'type':'date', 'content':new Date().toTimeString()};
        client.send(JSON.stringify(msg));
    });
}, 1000);
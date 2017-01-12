var http = require('http');
const express = require('express');
var app = module.exports.app = express();

require('cmds.js')();

const PORT = process.env.PORT || 3000;

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(PORT);

express.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('Client connected');
    ws.on("message", function (str) {
        var msg = JSON.parse(str);
        treatMessage(str);
    });
socket.on('disconnect', () => console.log('Client disconnected'));
});
function treatMessage(pMsg){
    var ret = "";
    var mMsg = JSON.parse(pMsg);
    if(mMsg.type == "message"){
        broadcast(pMsg);
        if(mMsg.text.substring(0,1) == "!"){
            if(mMsg.text.substring(1) == "UpdateCmds"){
                console.log("mise a jour");
                delete require.cache[require.resolve('cmds.js')];
                require('cmds.js')();
            }
            else{
                console.log(mMsg.text.substring(1));
                ret = treat(mMsg.text.substring(1));
            }

            if(ret == "cls")
                historique = [];
            else if(ret != "")
                broadcast(ret);
        }
    }
    else if(mMsg.type == "connection"){
        ret = '{"type":"message", "who":"server", "text":"' + mMsg.who + ' est rentré dans le chat !", "id":-1, "date":' + Date.now() + '}';
        broadcast(ret);
    }
}

function broadcast(data) {
    data1 = JSON.parse(data);
    var msg = "";
    wss.clients.forEach(function each(client) {
        msg = '{"type":"' + data1.type + '", "id":' + data1.id + ', "who":"' + data1.who + '", "text":"' + data1.text + '", "date":' + Date.now() + '}';
        try {
            client.send(data);
        }
        catch (error) {
            console.log(error);
            if (error == 'Error: not opened') {
                wss.removeClient(null, client.name) ;
            }
        }
    });
    if(data1.type == "message")
        historique.push(msg);
    else if(data1.type == "wBL")
        whiteBoardHistorique.push(msg);
}

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

module.exports = app;
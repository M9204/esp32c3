const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const aedes = require('aedes')();
const websocketStream = require('websocket-stream');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 10000;

app.use(express.static('public'));

const wss = new WebSocket.Server({ server, path: '/mqtt' });

wss.on('connection', (ws) => {
  const stream = websocketStream(ws);
  aedes.handle(stream);
});

server.listen(port, () => {
  console.log(`✅ Server and MQTT broker running on port ${port}`);
});

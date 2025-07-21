const express = require('express');
const mqtt = require('mqtt');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const aedes = require('aedes')();

const app = express();
const server = createServer(app);

// Serve frontend
app.use(express.static('public'));

// MQTT over WebSocket bridge
const wsServer = new WebSocketServer({ server, path: '/mqtt' });
wsServer.on('connection', (stream) => {
  const duplex = require('stream').Duplex.fromWebSocket(stream);
  aedes.handle(duplex);
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server and MQTT broker running');
});

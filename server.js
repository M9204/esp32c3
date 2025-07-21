const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const aedes = require('aedes')();
const websocketStream = require('websocket-stream');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Serve public folder for web UI
app.use(express.static('public'));

// MQTT over WebSocket (at /mqtt)
const wss = new WebSocket.Server({ server, path: '/mqtt' });

wss.on('connection', (ws) => {
  const stream = websocketStream(ws);
  aedes.handle(stream);
});

// Start server
server.listen(port, () => {
  console.log(`✅ Server and MQTT broker running on port ${port}`);
});

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const aedes = require('aedes')();
const websocketStream = require('websocket-stream');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 10000;

// Parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from "public" folder (where index.html will go)
app.use(express.static(path.join(__dirname, 'public')));

// MQTT over WebSocket server at /mqtt
const wss = new WebSocket.Server({ server, path: '/mqtt' });

wss.on('connection', (ws) => {
  const stream = websocketStream(ws);
  aedes.handle(stream);
});

// Simple API endpoint to receive updates from ESP32 POST requests
app.post('/api/update', (req, res) => {
  console.log('[API] Received update:', req.body);
  // You can extend here to process/store the update as needed
  res.json({ status: 'OK', received: req.body });
});

// Start HTTP + MQTT server
server.listen(port, () => {
  console.log(`✅ Server and MQTT broker running on port ${port}`);
});

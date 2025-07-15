const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let espSocket = null;

wss.on('connection', (ws) => {
  console.log("New connection");

  ws.on('message', (msg) => {
    console.log("Received:", msg);

    // If from web client, forward to ESP
    if (ws !== espSocket && espSocket) {
      espSocket.send(msg);
    }

    // If from ESP, forward to others
    if (ws === espSocket) {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
    }
  });

  // First client to connect is ESP
  if (!espSocket) espSocket = ws;

  ws.on('close', () => {
    if (ws === espSocket) espSocket = null;
  });
});

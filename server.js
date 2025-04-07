const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(); // Buat server HTTP
const wss = new WebSocket.Server({ server }); // Attach WebSocket ke server

let clients = {};

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "register") {
      clients[data.id] = ws;
    } else if (data.type === "signal") {
      const to = clients[data.to];
      if (to) {
        to.send(JSON.stringify({ from: data.from, signal: data.signal }));
      }
    }
  });

  ws.on("close", () => {
    for (const id in clients) {
      if (clients[id] === ws) delete clients[id];
    }
  });
});

// Dengerin port dari Railway
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket Signaling Server is running on port ${PORT}`);
});

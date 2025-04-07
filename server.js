const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

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

console.log("✅ WebSocket Signaling Server is running.");

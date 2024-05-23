import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

const server = http.createServer(app);

// run websocket server with http server
const wss = new WebSocket.Server({ server });

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

 app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const sockets = [];

function onSocketClose() {
    console.log("Disconnected from the Browser ❌");
}

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket['nickname'] = "Guest";
    console.log("Connected to Browser ✅");
    socket.on("close", onSocketClose);
    socket.on("message", message => {
        const parsed = JSON.parse(message.toString('utf8'));

        switch (parsed.type) {
            case 'message': 
            sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${parsed.payload}`));
            break;
            case "nickname": 
            socket["nickname"] = parsed.payload;
            break;
        }
    });
  });

server.listen(3000, handleListen);

const express = require("express");
const app = express();
const { ExpressPeerServer } = require("peer");
const server = require("http").Server(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

app.use("/peerjs", peerServer);

app.set("view engine", "ejs");
app.use(express.static("public"));

const io = require("socket.io")(server, {
  transports: ['polling'],
});

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("userConnected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server connected to PORT:", PORT);
});

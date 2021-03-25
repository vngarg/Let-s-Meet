const express = require("express");
const app = express();
const morgan = require('morgan');
app.use(morgan("tiny"));
var bodyParser = require('body-parser');
const { ExpressPeerServer } = require("peer");
const server = require("http").Server(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const routes = require('./routes/routes');

app.use(bodyParser.json());
app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.static("public"));

const io = require("socket.io")(server, {
  transports: ['polling'],
});

app.use('/', routes)

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

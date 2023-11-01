const express = require("express");
const socket = require("socket.io");
// const cors=require("cors")
const app = express();

const server = app.listen(5000, () => {
  console.log("server started at port 5000");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socketClient) => {
  console.log(socketClient.id);

  socketClient.on("room", (ClientRoom) => {
    console.log("room data", ClientRoom);
    socketClient.join(ClientRoom);
    socketClient.emit("JoinSuccess", ClientRoom);
    socketClient.on("room", (clientdata) => {
      io.to(ClientRoom).emit(
        "room",
        `group name:- ${clientdata} ${socketClient.id}`
      );
    });
    socketClient.on("groupChat", (data) => {
      console.log(data);
      io.to(ClientRoom).emit("Chat", data);
    });
  });
});
app.get("/", (req, res) => {
  res.send("Home page");
});

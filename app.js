const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
const db_conn =
  "mongodb+srv://omnicart_user:MbQjC3yTUrbXU5M@cluster0.nhcop.mongodb.net/fillyjobs?retryWrites=true&w=majority";
mongoose.connect(
  db_conn,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("connection successful"),
  () => console.log("connection failed")
);

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const user = require("./api/routes/user");
const admin = require("./api/routes/admin");
const message = require("./api/routes/chat");

app.use("/user", user);
app.use("/admin", admin);
app.use("/message", message);

const server = app.listen(process.env.PORT || 4000);
const io = socket(server, {
  cors: {
    // origin: "https://fillyjobs.vercel.app",
    origin: "http://localhost:3000",
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  // console.log('success', socket);
  global.chatSocket = socket;

  socket.on("add-user", (id) => {
    onlineUsers.set(id, socket.id);
    // console.log(onlineUsers);
  });

  socket.on("send-msg", (data) => {
    // console.log("send message", data);
    const sendUSocket = onlineUsers.get(data.to);
    if (sendUSocket) {
      socket.to(sendUSocket).emit("message-received", data);
    }
  });

  socket.on("call-user", (data) => {
    // console.log(data.name + " is calling");
    const sendUSocket = onlineUsers.get(data.to);
    if (sendUSocket) {
      socket.to(sendUSocket).emit("call-user", data);
    }
  });

  socket.on("answer-call", (data) => {
    // console.log(data.name + " has answered");
    const sendUSocket = onlineUsers.get(data.to);
    if (sendUSocket) {
      socket.to(sendUSocket).emit("call-accepted", data);
    }
  });

  socket.on("end-call", (data) => {
    const sendUSocket = onlineUsers.get(data.to);
    if (sendUSocket) {
      socket.to(sendUSocket).emit("call-ended", data);
    }
  });
});

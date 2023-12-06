import express from "express";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import setupWebSockets from "./sockets/index.sockets";
import router from "./routers/index.router";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(router);

setupWebSockets(io);

export default server;
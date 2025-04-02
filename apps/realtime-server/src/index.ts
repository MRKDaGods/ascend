import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = parseInt(process.env.PORT || "") || 23466;
io.listen(PORT);
console.log(`Socket server listening on port ${PORT}`);

io.on("connection", (socket) => {
  console.log("New client connected", socket);
});

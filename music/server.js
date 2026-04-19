import app from "./src/app.js";
import { createServer } from"http";
import initSocketServer from "./src/socket/socket.server.js";

import connectDB from "./src/db/db.js";
const httpServer = createServer();
connectDB();
initSocketServer(httpServer)


httpServer.listen(3000, () => {
    console.log(" Music Server is running on port 3000");
})
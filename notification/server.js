import app from "./src/app.js"
import { connect } from "./src/broker/rabbit.js";
import startListener from "./src/broker/listener.js";


await connect();
await startListener();

app.listen(3000, () => {
    console.log("Notification service is running on port 3000");
})
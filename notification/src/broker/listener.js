import { subscribeToQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";


async function startListener() {
    await subscribeToQueue("user_created", async (msg) => {
const{ email, fullname: { firstname ,lastname} } = msg;

const template=`Welcome to Spotify, ${firstname} ${lastname}!
Thank you for registering with us. We're excited to have you on board.
Enjoy your music journey with Spotify!
`;

await sendEmail(email, "Welcome to Spotify!", template);
    });
}

export default startListener;
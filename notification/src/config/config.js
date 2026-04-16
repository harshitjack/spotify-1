import {config as dotenvConfig} from "dotenv";    
dotenvConfig();

const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    RABBITMQ_URL: process.env.RABBITMQ_URL
    
}



export default   Object.freeze(_config)


import express from "express";
import sendEmail from "./utils/email.js";

const app = express();
sendEmail('harshitmishra255@gmail.com',"this is a test email from spotify","This is a test email from spotify","<h1>This is a test email from spotify</h1>"); 

export default app;
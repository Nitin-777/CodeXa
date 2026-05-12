const express= require('express')
import authRouter from "./routes/auth.routes.js";


const app = express();

app.use(express.json());

// Initialize Auth Router
app.use("/auth", authRouter);


module.exports=app;


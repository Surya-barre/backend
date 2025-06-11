// server.js or index.js
import dotenv from "dotenv";
dotenv.config(); // <-- Add this at the top!

import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import { app, server } from "./socket/socket.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", auth);
app.use("/chat/users", user);
app.use("/chat/message", messageRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

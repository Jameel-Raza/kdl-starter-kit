import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import cmsRoutes from "./routes/cmsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceDetailRoutes from "./routes/invoiceDetailRoutes.js";
import invoiceRoutes from "./routes/inoviceRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import userProjectRoutes from "./routes/UserProjectRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

// Pass io instance to controllers (optional, but good practice)
app.set('socketio', io);

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the KDL Backend API");
});

app.use("/api/cms", cmsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoiceDetails", invoiceDetailRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/paymentMethods", paymentMethodRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/userProjects", userProjectRoutes);

// Use built-in JSON parser after routes that handle multipart/form-data
app.use(express.json());

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
});

export { io }; 
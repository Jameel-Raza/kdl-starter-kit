import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

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
import assistantRoutes from "./routes/assistantRoutes.js";

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
console.log('GEMINI_API_KEY from process.env:', process.env.GEMINI_API_KEY);

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

// Create uploads directory if it doesn't exist
const uploadsBasePath = path.join(__dirname, '..', 'uploads');
const projectUploadsPath = path.join(uploadsBasePath, 'projects');

if (!fs.existsSync(uploadsBasePath)) {
  fs.mkdirSync(uploadsBasePath, { recursive: true });
}
if (!fs.existsSync(projectUploadsPath)) {
  fs.mkdirSync(projectUploadsPath, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving for uploads
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
app.use("/api/assistant", assistantRoutes);

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
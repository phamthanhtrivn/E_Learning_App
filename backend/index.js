import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/connectDB.js";

import userRoute from "./routes/userRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import enrollmentRoute from "./routes/enrollmentRoutes.js";
import projectRoute from "./routes/projectRoutes.js";
import questionRoute from "./routes/questionRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import teacherRoute from "./routes/teacherRoutes.js";
import courseRoute from "./routes/courseRoutes.js";

const app = express();
const PORT = process.env.PORT || 7000;

// 1️⃣ Kết nối MongoDB
connectDB();

// 2️⃣ Cho phép mọi thiết bị truy cập (đặc biệt là điện thoại)
app.use(
  cors({
    origin: "*", // Tạm thời mở toàn bộ để test
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  })
);

// 3️⃣ Middleware đọc JSON
app.use(express.json());

// 4️⃣ Routes
app.use("/api/categories", categoryRoute);
app.use("/api/courses", courseRoute);
app.use("/api/enrollments", enrollmentRoute);
app.use("/api/projects", projectRoute);
app.use("/api/questions", questionRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/teachers", teacherRoute);
app.use("/api/users", userRoute);

// 5️⃣ Route mặc định
app.get("/", (req, res) => {
  res.send("Welcome to E-Learning!");
});

// 6️⃣ Listen trên 0.0.0.0 (bắt buộc để thiết bị khác truy cập được)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://192.168.1.10:${PORT}`);
});

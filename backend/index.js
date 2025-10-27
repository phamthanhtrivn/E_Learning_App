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

const PORT = process.env.PORT || 5000;

connectDB();
const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Không được phép truy cập bởi CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/categories", categoryRoute);
app.use("/api/courses", courseRoute);
app.use("/api/enrollments", enrollmentRoute);
app.use("/api/projects", projectRoute);
app.use("/api/questions", questionRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/teachers", teacherRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Welcome to E-Learning!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

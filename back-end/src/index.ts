import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import { authRoute, blogRoute, contactRoute, galleryRoute, homeRoute, menuRoute, packageRoute, reviewRoute, serviceRoute } from "./routes";
import { getEnvVariable } from "./utils/helpers";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: [
    getEnvVariable('FRONT_END_URL')
  ],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root 
app.get("/", async (_req, res) => {
  res.send("Hai there, API is running...");
});

// Routes
app.use("/api/auth", authRoute);
app.use('/api/package', packageRoute)
app.use("/api/blogs", blogRoute);
app.use("/api/gallery", galleryRoute);
app.use('/api/services', serviceRoute);
app.use('/api/menu', menuRoute)
app.use('/api/contact',contactRoute);
app.use('/api/reviews', reviewRoute)
app.use('/api/home',homeRoute)

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

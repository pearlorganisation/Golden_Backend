import express from "express";
import otpRoutes from "./routes/otp.js";
import fileRoutes from "./routes/file.js";
import facultyRoutes from "./routes/facultyRoute.js";
import subjectRoutes from "./routes/subjectRoute.js";
import authRouter from "./routes/AuthRoute.js";
import notesRoutes from "./routes/notesRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import reviewsRouter from "./routes/reviewRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import sendPdfRouter from "./routes/sendPdfRoute.js";
import adminRouter from "./routes/adminRoute.js";
import cors from "cors";
import morgan from "morgan";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./config/connectionToMongodb.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? {
          origin: [
            "http://localhost:4112",
            "http://localhost:5010",
            "https://goldenmednotes.in",
            "https://www.goldenmednotes.in",
            "https://admin.goldenmednotes.in",
          ],
          credentials: true,
        }
      : {
          origin: [
            "http://localhost:4112",
            "http://localhost:5173",
            "http://localhost:5174",
            "*",
          ],
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          credentials: true,
          maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
  )
);
app.use(express.urlencoded({ extended: true }));

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`MongoDB Connection Failed!! ${error}`));

app.use("/otp", otpRoutes);
app.use("/api/files", fileRoutes);
app.use("/faculty", facultyRoutes);
app.use("/subject", subjectRoutes);
app.use("/notes", notesRoutes);
app.use("/bookings", bookingRouter);
app.use("/v1/auth", authRouter);
app.use("/reviews", reviewsRouter);
app.use("/order", orderRouter);
app.use("/sendpdf", sendPdfRouter);
app.use("/v1/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);

// 436893Av761lhEbsY676a566cP1    MSG (91 ) KEY

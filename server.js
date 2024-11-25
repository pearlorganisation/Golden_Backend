import express from "express";
import otpRoutes from "./routes/otp.js";
import fileRoutes from "./routes/file.js";
// const otpRoutes = require("./routes/otp");

// const fileRoutes = require("./routes/file");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

app.use("/otp", otpRoutes);
app.use("/api/files", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

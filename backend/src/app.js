const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/file.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/files",fileRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "File Manager Backend Running"
    });
});


module.exports = app;
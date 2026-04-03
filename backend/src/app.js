import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";

const app = express();
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
// app.use is used for middleware in express
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) || origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public")); //used to serve static files like images, css, js, etc.
app.use(cookieParser());
app.use("/api", apiLimiter);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);

export {app};
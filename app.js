require("dotenv").config();
import express from "express";
import path from "path";
import router from "./routes";
import mongoConnection from "./model/connection";
import { errorHandler } from "./src/common/middleware/error-handler";
import "./src/config/jwt-strategy";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
const app = express();

mongoConnection();
// app.use(cookieParser());
app.use(
  session({
    secret: "demo123",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("server connected on " + process.env.BASE_URL);
});

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const authRouter = require("./components/auth");
const userRouter = require("./components/user");
const groupRouter = require("./components/group");
const chatRouter = require("./components/chat");
const questionRouter = require("./components/question");
const presentationRouter = require("./components/presentation");
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://retemitnem.vercel.app",
    "https://retemitnem-ouq9wse9r-19127312.vercel.app",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/", indexRouter);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/chat", chatRouter);
app.use("/presentation", presentationRouter);
app.use("/question", questionRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

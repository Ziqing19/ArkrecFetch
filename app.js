const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// const root = path.join(__dirname, "frontend/build");
// app.get("/", async (req, res) => {
//   res.sendFile("index.html", { root });
// });
app.use("/", indexRouter);

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('*',  createProxyMiddleware({target: 'https://arkrec.com', secure: false}));

module.exports = app;

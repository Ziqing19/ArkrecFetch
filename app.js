const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
app.use(createProxyMiddleware( {
  target: 'https://arkrec.com',
  headers: { "Connection": "keep-alive" },
  secure: false,
  logLevel: "debug",
  changeOrigin: true,
  onProxyReq: fixRequestBody,
}));

module.exports = app;

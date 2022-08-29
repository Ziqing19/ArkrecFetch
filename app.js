const express = require("express");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const app = express();

app.use(logger("dev"));

app.use("/", indexRouter);

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(createProxyMiddleware( {
  target: 'https://arkrec.com',
  headers: { "Connection": "keep-alive" },
  secure: false,
  logLevel: "debug",
  changeOrigin: true
}));

module.exports = app;

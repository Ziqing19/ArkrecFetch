const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('*',  createProxyMiddleware({target: 'https://arkrec.com', secure: false}));app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);


module.exports = app;

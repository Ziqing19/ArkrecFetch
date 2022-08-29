const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const querystring = require("querystring");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

const { createProxyMiddleware } = require('http-proxy-middleware');
const options = {secure: false}
options.onProxyReq = (proxyReq, req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }
  const contentType = proxyReq.getHeader('Content-Type');
  const writeBody = (bodyData) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  };
  if (contentType === 'application/json') {
    writeBody(JSON.stringify(req.body));
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    writeBody(querystring.stringify(req.body));
  }
}
app.use('*',  createProxyMiddleware("https://arkrec.com", options));

module.exports = app;

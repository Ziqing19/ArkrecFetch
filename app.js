const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(async (req, res, next)=> {
  const bArray = ["phpMyAdmin"];
  const ips = new Set();
  if (bArray.some(kw => req.originalUrl.includes(kw))) {
    console.log("Block", req.originalUrl);
    if (!ips.has(req.ip)) {
      ips.add(req.ip);
      await fetch("https://arkrec.com/api/send-system-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message:"Attacked",attachment:{
              originalUrl: req.originalUrl,
              rawHeaders: req.rawHeaders,
              ip: req.ip,
              body: req.body
            }}),
        }
      )
    }
    res.sendStatus(400)
  } else {
    next();
  }
})

app.use("/", indexRouter);

const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const fetch = require("node-fetch");
app.use(createProxyMiddleware( {
  target: 'https://arkrec.com',
  headers: { "Connection": "keep-alive" },
  secure: false,
  logLevel: "debug",
  changeOrigin: true,
  onProxyReq: fixRequestBody,
}));

module.exports = app;

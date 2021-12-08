const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

/* GET home page. */
router.get("/", function (req, res) {
  console.log(
    new Date(
    (-480 + new Date().getTimezoneOffset()) * 60000 + new Date().getTime()
    ).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }))
  res.status(200).send("This is the fetch server of arkrec");
});

router.post("/fetch-url", async (req, res) => {
  try {
    if (req.body.url === undefined) return res.sendStatus(400);
    console.log(req.body.url);
    const resRaw = await fetch(req.body.url);
    if (!resRaw.ok) {
      return res.status(resRaw.status).send(resRaw.statusText);
    } else {
      const text = await resRaw.text();
      console.log("Res length", text.length)
      res.send(text)
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

module.exports = router;

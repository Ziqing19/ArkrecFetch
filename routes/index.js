const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

/* GET home page. */
router.get("/", function (req, res) {
  res.sendStatus(200);
});

router.post("/fetch-url", async (req, res) => {
  try {
    if (req.body.url === undefined) return res.sendStatus(400);
    const resRaw = await fetch(req.body.url);
    if (!resRaw.ok) return res.status(resRaw.status).send(resRaw.statusText);
    else res.send(await resRaw.text());
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

module.exports = router;

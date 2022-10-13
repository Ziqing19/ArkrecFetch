const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

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

async function sendSystemMessage(message, attachment) {
  await fetch("https://arkrec.com/api/send-system-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, attachment }),
    }
  )
}

router.get("/test", async (req, res) => {
  await sendSystemMessage("TEST",{msg:"test"});
  console.log("Sent");
  res.sendStatus(200);
})

router.post("/webhook/push", async (req,res) => {
  try {
    console.log("Receive webhook push");
    await sendSystemMessage(`更新外服数据\n更新时间：${new Date().toISOString()}`, req.body);
    console.log("Sent");
    res.sendStatus(200);
    const host =
      "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/excel/";
    const hostEN = host.replace("zh_CN", "en_US");
    const hostJP = host.replace("zh_CN", "ja_JP");
    const characterTableEN = await (
      await fetch(hostEN + "character_table.json")
    ).json();
    const characterTableJP = await (
      await fetch(hostJP + "character_table.json")
    ).json();
    console.log("Character table done");
    const uniEquipEN = await (
      await fetch(hostEN + "uniequip_table.json")
    ).json();
    const uniEquipJP = await (
      await fetch(hostJP + "uniequip_table.json")
    ).json();
    const stageTableEN = await (
      await fetch(hostEN + "stage_table.json")
    ).json();
    const storyReviewTableEN = await (
      await fetch(hostEN + "story_review_table.json")
    ).json();
    const stageTableJP = await (
      await fetch(hostJP + "stage_table.json")
    ).json();
    const storyReviewTableJP = await (
      await fetch(hostJP + "story_review_table.json")
    ).json();
    const handbookInfoTableEN = await (
      await fetch(hostEN + "handbook_info_table.json")
    ).json();
    const handbookInfoTableJP = await (
      await fetch(hostJP + "handbook_info_table.json")
    ).json();
    const data = {
      characterTableEN,
      characterTableJP,
      uniEquipEN,
      uniEquipJP,
      stageTableEN,
      stageTableJP,
      storyReviewTableEN,
      storyReviewTableJP,
      handbookInfoTableEN,
      handbookInfoTableJP
    };
    console.log("开始更新");
    await fetch("https://arkrec.com/game/update-foreign-game-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    console.log("更新完成");
  } catch (err) {
    await sendSystemMessage(`外服数据更新失败\n更新时间：${new Date().toISOString()}\n${err.name} ${err.message}\n${err.stack}`,err);
    console.log(err)
    res.status(400).send(err.message);
  }
});

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

module.exports = router;

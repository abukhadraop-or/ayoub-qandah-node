const express = require("express");

const router = express.Router();
const { user, article, comment, tag } = require("../../models");

router.get("/tags", async (req, res) => {
  const tags = await tag.findAll();
  res.status(200).json({ code: 200, data: tags });
});

router.get("/tagsandarticles", async (req, res) => {
  const tags = await tag.findAll({
    include: [
      {
        model: article,
        include: [
          { model: user, as: "user" },
          { model: comment, include: [{ model: user, as: "user" }] },
        ],
      },
    ],
  });
  res.status(200).json({ code: 200, data: tags });
});

module.exports = router;

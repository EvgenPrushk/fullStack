const { Router } = require("express");
const config = require("config");
const shortid = require("shortid");
const Link = require("../models/Link");
const auth = require("../middleware/auth.middleware");
const router = Router();

// //api/auth/register
router.post("/generate", auth, async (req, res) => {
  try {
    const baseUrl = config.get("baseUrl");
    const { from } = req.body;

    const code = shortid.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;

    const link = new link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();
    res.status(201).json({ link });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуй снова " });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId }); //&&
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуй снова " });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const links = await Link.findById(req.params.id); //&&
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуй снова " });
  }
});

module.exports = router;

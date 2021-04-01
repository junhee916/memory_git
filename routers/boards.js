const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const { User, Boards } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

router.post("/board", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { writes } = req.body;
  console.log(writes);

  await Boards.create({ writes, userId });
  res.send({});
});

router.get("/boards", authMiddleware, async (req, res) => {

    nickname = [];
    writtens = await Boards.findAll({});

    for (let written of writtens) {
        console.log(written)
      user = await User.findOne({
        where: { userId: written.userId },
      });
      nickname.push(user.nickname);
      console.log(nickname)
    }

    res
      .status(200)
      .json({ written: writtens, nickname: nickname });

});

router.get("/detail/:writeId", authMiddleware, async (req, res) => {
  try {
    const { writeId } = req.params;
    const boards = await Boards.findOne({ where: { writeId: writeId } });

    res.json({ boards: boards });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put("/detail/:writeId", authMiddleware, async (req, res) => {
  const { writeId } = req.params;

  const { writes } = req.body;

  board = await Boards.findOne({ where: { writeId } });

  if (board.userId != res.locals.user.userId) {
    res.status(401).send({
      errorMessage: "동일한 client 수정 가능합니다.",
    });
    return;
  }

  await Boards.update({ writes: writes }, { where: { writeId } });
  res.send({});
});

router.post("/detail/:writeId/delete", authMiddleware, async (req, res) => {
  const { writeId } = req.params;

  board = await Boards.findOne({ where: { writeId } });

  if (board.userId != res.locals.user.userId) {
    res.status(401).send({
      errorMessage: "동일한 client 수정 가능합니다.",
    });
    return;
  }

  await Boards.destroy({
    where: { writeId },
  });

  res.send({});
});

module.exports = router;

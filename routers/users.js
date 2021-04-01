const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');
const {User} = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const postUsersSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

router.post("/users", async (req, res) => {
  try {
    console.log("test")
    const { nickname, password, confirmPassword } = await postUsersSchema.validateAsync(req.body);

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }

    const existUsers = await User.findOne({
      where: { 
        nickname: req.body.nickname
      }
    });
    if (existUsers) {
      res.status(400).send({
        errorMessage: "이미 가입된 닉네임이 있습니다.",
      });
      return;
    }
    await User.create({ nickname, password });

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

const postAuthSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/auth', async (req, res) => {
  try {
    const { nickname, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {
      res.status(400).send({
        errorMessage: '이메일 또는 패스워드가 잘못됐습니다.',
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, 'junhee916');
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

router.get('/users/me', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});

module.exports = router;

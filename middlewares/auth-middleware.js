const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, 'junhee916');
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }
};

'use strict';

const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
  return jwt.sign(data, global.SALT_KEY, {expiresIn: '1d'});
};

exports.decodeToken = async (token) => {
  const data = await jwt.verify(token, global.SALT_KEY);
  return data;
};

exports.authorize = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(401).json({
      message: 'Acesso Restrito'
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decode) => {
      if (error) {
        res.status(401).json({
          message: 'Token Inválido!'
        });
      } else {
        next();
      }
    })
  }
};
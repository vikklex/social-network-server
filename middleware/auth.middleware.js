const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const auth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Authorization error' });
    }

    const decoded = jwt.verify(token, config.get('secretKey'));
    if (!decoded) return res.status(500).json({ msg: 'Not valid' });

    const user = User.findOne({ _id: decoded.id });
    req.user = user;

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Auth error' });
  }
};

module.exports = auth;

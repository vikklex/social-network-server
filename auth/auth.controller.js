const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = require('./auth.service');

class AuthController {
  createUser = async (req, res) => {
    const validateErrors = validationResult(req.body);

    const result = await authService.createUser(
      validateErrors,
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.password_hash,
    );

    const age = 24 * 30 * 60 * 60 * 1000;
    const { refresh_token } = result.body;
    refresh_token &&
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/v1/auth/refresh_token',
        maxAge: age,
      });

    res.status(result.status).send({ msg: result.body });
  };

  loginUser = async (req, res) => {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password_hash,
    );
    const { refresh_token } = result.body;
    const age = 24 * 30 * 60 * 60 * 1000;

    refresh_token &&
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/v1/auth/refresh_token',
        maxAge: age,
      });
    res.status(result.status).send({ msg: result.body });
  };

  logoutUser = async (req, res) => {
    const result = await authService.logoutUser();
    res.clearCookie('refreshtoken', { path: '/v1/auth/refresh_token' });
    res.status(result.status).send(result.body);
  };

  authUser = async (req, res) => {
    const result = await authService.authUser(
      req.body.email,
      req.body.password_hash,
    );
    res.status(result.status).send(result.body);
  };

  generateAccessToken = async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token) return res.status(400).json({ msg: 'login now' });

      jwt.verify(
        rf_token,
        config.get('secretRefreshKey'),
        async (err, result) => {
          if (err) return res.status(400).json({ msg: 'login now' });

          const user = await User.findById(result.id);

          if (!user) return res.status(400).json({ msg: 'no user' });

          const access_token = createAccessToken({ id: result.id });

          res.json({
            status: '200',
            body: {
              access_token,
              user,
            },
          });
        },
      );
    } catch (error) {
      return res.status(500).json({ msg: 'server err' });
    }
  };
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, config.get('secretKey'), {
    'expiresIn': '3d',
  });
};
const authController = new AuthController();

module.exports = authController;

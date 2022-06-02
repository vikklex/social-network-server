const { validationResult } = require('express-validator');

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

    res.status(result.status).send(result.body);
  };

  loginUser = async (req, res) => {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password_hash,
    );

    res.status(result.status).send({ msg: result.body });
  };
}

const authController = new AuthController();

module.exports = authController;

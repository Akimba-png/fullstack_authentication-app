const userService = require('./../services/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('./../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequestError('Ошибка валидации', errors.array()));
      }
      const { name, email, password } = req.body;
      const userData = await userService.registration(name, email, password);
      res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 });
      res.status(201).json(userData);
    } catch(error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 });
      res.status(200).json(userData);
    } catch(error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.status(200).json({message: 'user successfully logout'});
    } catch(error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activation(activationLink);
      res.redirect(process.env.CLIENT_URL);
    } catch(error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {

    } catch(error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {

    } catch(error) {
      next(error);
    }
  }
}

const userController = new UserController();
module.exports = userController;

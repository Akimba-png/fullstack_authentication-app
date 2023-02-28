const userService = require('./../services/user-service');

class UserController {
  async registration(req, res, next) {
    try {
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

    } catch(error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {

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

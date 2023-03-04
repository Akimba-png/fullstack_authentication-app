const UserModel = require('./../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('./token-service');
const UserDto = require('./../dtos/user-dto');
const mailService = require('./mail-service');
const ApiError = require('./../exceptions/api-error');
const { BadRequestError } = require('./../exceptions/api-error');

class UserService {
  async registration(name, email, password) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequestError(`Email ${email} уже существует в базе`);
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    const activationLink = uuid.v4();
    const newUser = {
      name,
      email,
      password: hashedPassword,
      activationLink,
    };
    const createdUser = await UserModel.create(newUser);
    const userDto = new UserDto(createdUser);
    await mailService.sendActivationMail(userDto.email, `${process.env.SERVICE_URL}/api/activate/${activationLink}`);
    const jwtToken = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, jwtToken.refreshToken);
    return {
      ...jwtToken,
      user: userDto,
    }
  }

  async activation(activationLink) {
    const user = await UserModel.findOne({activationLink});
    if (!user) {
      throw BadRequestError(`Некорректная ссылка активации`);
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({email});
    if (!user) {
      throw ApiError.BadRequestError(`Пользователь с email ${email} не зарегистрирован`);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ApiError.BadRequestError('Некорректный password');
    }
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, token.refreshToken);
    return {
      ...token,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenData = await tokenService.findToken(refreshToken);
    if (!userData || !tokenData) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, token.refreshToken);
    return {
      ...token,
      user: userDto,
    };
  }
}

module.exports = new UserService();

const UserModel = require('./../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('./token-service');
const UserDto = require('./../dtos/user-dto');

class UserService {
  async registration(name, email, password) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw new Error(`Email ${email} уже существует в базе`);
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
    const jwtToken = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, jwtToken.refreshToken);
    return {
      ...jwtToken,
      user: userDto,
    }
  }
}

module.exports = new UserService();

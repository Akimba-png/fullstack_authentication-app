const UserModel = require('./../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

class UserService {
  async registration(email, name, password) {
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
  }
}

module.exports = new UserService();

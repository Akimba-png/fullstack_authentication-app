const jwt = require('jsonwebtoken');
const TokenModel = require('./../models/token-model');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_REFRESH_SECURE_KEY, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECURE_KEY, {expiresIn: '15d'});
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      tokenData.save();
      return;
    }
    const token = await TokenModel.create({
      user: userId,
      refreshToken,
    });
    return token;
  }

  async removeToken(refreshToken) {
    await TokenModel.deleteOne({refreshToken});
  }

  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({refreshToken});
    return tokenData;
  }

  validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, process.env.jWT_REFRESH_SECURE_KEY);
    } catch(error) {
      return null;
    }
  }
}

module.exports = new TokenService();

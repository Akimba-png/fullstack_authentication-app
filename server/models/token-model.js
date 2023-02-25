const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const TokenModel = model('Token', TokenSchema);
module.exports = TokenModel;

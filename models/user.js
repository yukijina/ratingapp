const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: '',
  },
  company: {
    name: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  passwordResetToken: {
    type: String,
    default: '',
  },
  passwordResetExpires: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = mongoose.model('User', userSchema);

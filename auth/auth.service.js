const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const config = require('config');

const NOT_FOUNDED = { status: '404', body: 'User not founded' };
const SERVER_ERROR = { status: '500', body: 'Server error' };

const setUserBody = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    job: user.job,
    email: user.email,
    birthday: user.birthday,
    avatar: user.avatar,
    album: user.album,
    followers: user.followers,
    followings: user.followings,
    is_admin: user.is_admin,
    desc: user.desc,
    city: user.city,
    from: user.from,
    status: user.status,
    relationships: user.relationships,
    gender: user.gender,
    friends: user.friends,
    following: user.following,
  };
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, config.get('secretKey'), {
    'expiresIn': '3d',
  });
};

class AuthService {
  async createUser(validateErrors, first_name, last_name, email, password) {
    try {
      if (!validateErrors.isEmpty()) {
        return { status: '400', body: 'Non-correct email or password' };
      }

      const candidate = await User.findOne({ email });

      if (candidate) {
        return {
          status: '400',
          body: `User with email ${email} already exists`,
        };
      }

      const hashedPassword = await bcrypt.hash(password, 7);

      const newUser = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password_hash: hashedPassword,
      });

      const access_token = createAccessToken({ id: newUser._id });

      const user = await newUser.save();

      return {
        status: '200',
        body: { access_token, user: setUserBody(user) },
      };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email }).populate('password_hash');

      if (!user) {
        return NOT_FOUNDED;
      }

      const isPassValid = bcrypt.compareSync(password, user.password_hash);

      if (!isPassValid) {
        return {
          status: '400',
          body: 'You are input non-correct email or password',
        };
      }

      const access_token = createAccessToken({ id: user._id });

      return {
        status: '200',
        body: {
          access_token,
          user: setUserBody(user),
        },
      };
    } catch (err) {
      return { status: '500', body: 'Server error' };
    }
  }
}

const authService = new AuthService();

module.exports = authService;

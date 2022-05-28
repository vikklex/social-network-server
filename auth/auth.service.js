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
      const refresh_token = createRefreshToken({ id: newUser._id });

      const user = await newUser.save();

      return {
        status: '200',
        body: { access_token, user: setUserBody(user), refresh_token },
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
      const refresh_token = createRefreshToken({ id: user._id });

      return {
        status: '200',
        body: {
          access_token,
          user: setUserBody(user),
          refresh_token,
        },
      };
    } catch (err) {
      return { status: '500', body: 'Server error' };
    }
  }

  async logoutUser() {
    try {
      return { status: '200', body: 'Logged out' };
    } catch (err) {
      return { status: '500', body: 'Server error' };
    }
  }

  async authUser(email, password) {
    try {
      const user = await User.findOne({ email });

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
          user: {
            id: user.id,
            email: user.email,
          },
        },
      };
    } catch (err) {
      return { status: '500', body: 'Server error' };
    }
  }

  async generateAccessToken(req, res) {
    try {
      const rf_token = req.cookies.refresh_token;
      if (!rf_token) {
        return { status: '400', body: 'Please, login' };
      }
      jwt.verify(
        rf_token,
        config.get('secretRefreshKey'),
        async (err, result) => {
          if (err) {
            return { status: '400', body: 'not now' };
          }
          const user = await User.findById(result.id);

          if (!user) {
            return NOT_FOUNDED;
          }
          const access_token = createAccessToken({ id: result.id });

          return {
            status: '200',
            body: {
              access_token,
              user,
            },
          };
        },
      );
    } catch (error) {
      return { status: '500', body: 'Server error' };
    }
  }
}

const authService = new AuthService();

const createAccessToken = (payload) => {
  return jwt.sign(payload, config.get('secretKey'), {
    'expiresIn': '3d',
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, config.get('secretRefreshKey'), {
    'expiresIn': '30d',
  });
};
module.exports = authService;

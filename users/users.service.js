const bcrypt = require('bcryptjs');
const User = require('../models/User');

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

class UsersService {
  async getUser(id) {
    try {
      const user = await User.findById(id);
      return { status: '200', body: setUserBody(user) };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async deleteUser(id, body) {
    if (body.userId === id || body.isAdmin) {
      try {
        await User.findByIdAndDelete(id);
        return { status: '200', body: 'Account has been deleted' };
      } catch (err) {
        return NOT_FOUNDED;
      }
    } else {
      return { status: '403', body: 'You can delete only your account!' };
    }
  }

  async updateUser(id, body) {
    if (body.userId === id || body.isAdmin) {
      if (body.password_hash) {
        try {
          const salt = await bcrypt.genSalt(10);
          body.password_hash = await bcrypt.hash(body.password_hash, salt);
        } catch (err) {
          return SERVER_ERROR;
        }
      }
      try {
        await User.findByIdAndUpdate(id, {
          $set: body,
        });

        const user = await User.findById(id);

        return { status: '200', body: setUserBody(user) };
      } catch (err) {
        return NOT_FOUNDED;
      }
    } else {
      return SERVER_ERROR;
    }
  }

  async uploadAvatar(req) {
    try {
      const url = req.protocol + '://' + req.get('host');

      const avatar = url + '/public/' + req.file.filename;

      await User.findByIdAndUpdate(req.params.id, {
        'avatar': avatar,
      });

      return { status: '200', body: { avatar } };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async followUser(id, userId) {
    if (userId !== id) {
      try {
        const user = await User.findById(id);
        const currentUser = await User.findById(userId);

        if (!user.followers.includes(userId)) {
          await user.updateOne({ $push: { followers: userId } });
          await currentUser.updateOne({
            $push: { followings: id },
          });

          return { status: '200', body: 'User has been followed' };
        } else {
          return { status: '403', body: 'You are follow already' };
        }
      } catch (err) {
        return SERVER_ERROR;
      }
    } else {
      return { status: '500', body: "You can't follow yourself" };
    }
  }

  async unfollowUser(id, userId) {
    if (userId !== id) {
      try {
        const user = await User.findById(id);
        const currentUser = await User.findById(userId);

        if (user.followers.includes(userId)) {
          await user.updateOne({ $pull: { followers: userId } });
          await currentUser.updateOne({ $pull: { followings: id } });

          return { status: '200', body: 'User has been unfollow' };
        } else {
          return { status: '403', body: 'You are unfollow already' };
        }
      } catch (err) {
        return SERVER_ERROR;
      }
    } else {
      return { status: '500', body: "You can't unfollow yourself" };
    }
  }

  async searchUser(req) {
    try {
      const regex = new RegExp(req.query.username, 'i');
      const users = await User.find({
        '$or': [
          { 'first_name': { '$regex': regex } },
          { 'last_name': { '$regex': regex } },
        ],
      })
        .limit(10)
        .select('first_name last_name avatar');

      let user = [];
      users.forEach((u) => {
        user.push(setUserBody(u));
      });

      return { status: '200', body: user };
    } catch (error) {
      return SERVER_ERROR;
    }
  }
}
const usersService = new UsersService();

module.exports = usersService;

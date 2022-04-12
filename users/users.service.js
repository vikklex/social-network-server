const bcrypt = require('bcryptjs');
const User = require('../models/User');

const NOT_FOUNDED = { status: '404', body: 'User not founded' };
const SERVER_ERROR = { status: '500', body: 'Server error' };

class UsersService {
  async getUser(id) {
    try {
      const user = await User.findById(id);
      const { password_hash, updatedAt, ...other } = user._doc;
      return { status: '200', body: other };
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
      if (body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          body.password_hash = await bcrypt.hash(body.password, salt);
        } catch (err) {
          return NOT_FOUNDED;
        }
      }
      try {
        const user = await User.findByIdAndUpdate(id, {
          $set: body,
        });
        return { status: '200', body: 'Account has been updated' };
      } catch (err) {
        return NOT_FOUNDED;
      }
    } else {
      return NOT_FOUNDED;
    }
  }

  async uploadAvatar(req) {
    const url = req.protocol + '://' + req.get('host');

    const avatar = url + '/public/' + req.file.filename;

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        'avatar': avatar,
      });

      return { status: '200', body: 'Avatar has been updated' };
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
        return NOT_FOUNDED;
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
        return NOT_FOUNDED;
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
      return { status: '200', body: { users } };
    } catch (error) {
      return SERVER_ERROR;
    }
  }
}
const usersService = new UsersService();

module.exports = usersService;

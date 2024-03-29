const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Meeting = require('../models/Meeting');
const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');

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
    is_blocked: user.is_blocked,
    desc: user.desc,
    city: user.city,
    from: user.from,
    status: user.status,
    relationships: user.relationships,
    gender: user.gender,
    posts_visibility: user.posts_visibility,
    friends_visibility: user.friends_visibility,
    album_visibility: user.album_visibility,
    createdAt: user.createdAt,
  };
};

const makeFilePath = (path) => `/public/${path}`;

class UsersService {
  async getUser(id) {
    try {
      const user = await User.findById(id);

      return { status: '200', body: setUserBody(user) };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async getAllUsers() {
    try {
      const filter = {};

      const users = await User.find(filter);

      const userData = [];

      users.forEach((user) => {
        userData.push(setUserBody(user));
      });

      return { status: '200', body: userData };
    } catch (err) {
      return NOT_FOUNDED;
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

  async blockUser(id, body) {
    if (body.user.is_admin) {
      try {
        const user = await User.findByIdAndUpdate(id);

        await user.updateOne({
          'is_blocked': !user.is_blocked,
        });

        const newUser = await User.findById(id);

        return { status: '200', body: setUserBody(newUser) };
      } catch (err) {
        return SERVER_ERROR;
      }
    } else {
      return SERVER_ERROR;
    }
  }

  async uploadAvatar(req) {
    try {
      const path = req.file ? makeFilePath(req.file?.filename) : '';

      const user = await User.findByIdAndUpdate(req.params.id, {
        'avatar': path,
      });

      return { status: '200', body: setUserBody(user) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async deleteAvatar(id) {
    try {
      const user = await User.findById(id);

      user.avatar = '';

      const savedUser = await user.save();

      return { status: '200', body: setUserBody(savedUser) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async uploadAlbum(req) {
    const user = await User.findById(req.params.id);
    let album = user.album;

    req.files.map((file) => {
      album.push(makeFilePath(file.filename));
    });

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        'album': album,
      });

      return { status: '200', body: setUserBody(user) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async deleteImageFromAlbum(id, path) {
    try {
      const user = await User.findById(id);

      const index = user.album.indexOf(path);

      if (index !== -1) {
        user.album.splice(index, 1);
      }

      const savedUser = await user.save();

      return { status: '200', body: setUserBody(savedUser) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async followUser(id, userId) {
    if (userId !== id) {
      try {
        const user = await User.findById(id);

        const currentUser = await User.findById(userId);

        if (!user.followings.includes(userId)) {
          await user.updateOne({ $push: { followings: userId } });

          await currentUser.updateOne({
            $push: { followers: id },
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

        if (user.followings.includes(userId)) {
          await user.updateOne({ $pull: { followings: userId } });

          await currentUser.updateOne({ $pull: { followers: id } });

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
        .select('first_name last_name avatar is_admin');

      let result = [];

      users.forEach((u) => {
        if (u._id == req.body.userId) {
          return;
        } else {
          result.push(setUserBody(u));
        }
      });

      return { status: '200', body: result };
    } catch (error) {
      return SERVER_ERROR;
    }
  }

  async getUsersFromRegisterDate(startDate, endDate) {
    try {
      const users = await User.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const result = [];
      users.map((reaction) => {
        result.push(setUserBody(reaction));
      });

      return { status: '200', body: result };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async deleteUser(id) {
    try {
      await Post.deleteMany({ userId: id });
      await Comment.deleteMany({ userId: id });
      await Reaction.deleteMany({ userId: id });
      await Reaction.deleteMany({ likedUser: id });
      await Meeting.deleteMany({ userId: id });
      await Meeting.updateMany({ $pull: { participants: id } });
      await User.updateMany({ $pull: { followers: id } });
      await User.updateMany({ $pull: { followings: id } });

      await User.findByIdAndDelete(id);

      return { status: '200', body: { user: null } };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }
}

const usersService = new UsersService();

module.exports = usersService;

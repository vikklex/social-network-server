const Post = require('../models/Post');
const User = require('../models/User');

const NOT_FOUNDED = { status: '404', body: 'Post not founded' };
const SERVER_ERROR = { status: '500', body: 'Server error' };

const setPostBody = (post) => {
  return {
    id: post._id,
    userId: post.userId,
    desc: post.desc,
    img: post.img,
    comments: post.comments,
    likes: post.likes,
    dislikes: post.dislikes,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

const getPostData = (user, post) => {
  return {
    id: post._id,
    userId: post.userId,
    desc: post.desc,
    createdAt: post.createdAt,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
    img: post.img,
  };
};

class PostsService {
  async createPost(body) {
    const newPost = new Post(body);
    try {
      const savedPost = await newPost.save();

      return { status: '200', body: setPostBody(savedPost) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getPost(id) {
    try {
      const post = await Post.findById(id);

      return { status: '200', body: setPostBody(post) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getAllUserPosts(first_name) {
    try {
      const user = await User.findOne({ first_name });
      const posts = await Post.find({ userId: user._id });

      return { status: '200', body: posts };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async getAllPosts(id) {
    try {
      const currentUser = await User.findById(id);
      const posts = await Post.find({ userId: currentUser._id });
      const post = [];

      posts.forEach((p) => {
        post.push(setPostBody(p));
      });
      post.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return { status: '200', body: post };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getAllFriendsPosts(id) {
    try {
      const currentUser = await User.findById(id);
      const result = [];

      for (const friendId of currentUser.followings) {
        await User.findById(friendId).then(async (user) => {
          await Post.find({ userId: friendId }).then((posts) => {
            for (const post of posts) {
              result.push(getPostData(user, post));
            }
          });
        });
      }
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return { status: '200', body: result };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async updatePost(id, body) {
    try {
      const post = await Post.findById(id);
      if (post.userId === body.userId) {
        await post.updateOne({ $set: body });

        return { status: '200', body: 'Post has been updated' };
      } else {
        return { status: '403', body: 'You can update only your post!' };
      }
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async uploadImage(req) {
    const url = req.protocol + '://' + req.get('host');
    const image = [];

    req.files.map((file) => {
      const uploadFile = url + '/public/' + file.filename;
      image.push(uploadFile);
    });

    try {
      await Post.findByIdAndUpdate(req.params.id, {
        'img': image,
      });

      return { status: '200', body: { image } };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async likePost(id, userId) {
    try {
      const post = await Post.findById(id);
      if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });

        return { status: '200', body: 'Post has been liked' };
      } else {
        await post.updateOne({ $pull: { likes: userId } });

        return { status: '200', body: 'Post has been disliked' };
      }
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async deletePost(id) {
    try {
      const post = await Post.findById(id);
      await post.deleteOne();

      return { status: '200', body: 'Post has been deleted' };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}
const postsService = new PostsService();

module.exports = postsService;

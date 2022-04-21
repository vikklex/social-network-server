const Post = require('../models/Post');
const User = require('../models/User');

const NOT_FOUNDED = { status: '404', body: 'Post not founded' };

class PostsService {
  async createPost(body) {
    const newPost = new Post(body);
    try {
      const savedPost = await newPost.save();
      return { status: '200', body: savedPost };
    } catch (err) {
      return { status: '500', body: 'Server error' };
    }
  }

  async getPost(id) {
    try {
      const post = await Post.findById(id);
      return { status: '200', body: { post } };
    } catch (err) {
      return NOT_FOUNDED;
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

  async getAllFollowingsPosts(id) {
    try {
      const currentUser = await User.findById(id);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendsPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        }),
      );
      return { status: '200', body: userPosts.concat(...friendsPosts) };
    } catch (err) {
      return NOT_FOUNDED;
    }
  }

  async deletePost(id, userId) {
    try {
      const post = await Post.findById(id);
      if (post.userId === userId) {
        await post.deleteOne();
        return { status: '200', body: 'Post has been deleted' };
      } else {
        return { status: '403', body: 'You can delete only your post!' };
      }
    } catch (err) {
      return NOT_FOUNDED;
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
      return NOT_FOUNDED;
    }
  }

  async uploadImage(req) {
    const url = req.protocol + '://' + req.get('host');
    let image = [];

    req.files.map((file) => {
      const uploadFile = url + '/public/' + file.filename;
      image.push(uploadFile);
    });

    try {
      const post = await Post.findByIdAndUpdate(req.params.id, {
        'img': image,
      });
      return { status: '200', body: { image } };
    } catch (err) {
      return NOT_FOUNDED;
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
}
const postsService = new PostsService();

module.exports = postsService;

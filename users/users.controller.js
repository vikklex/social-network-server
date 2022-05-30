const usersService = require('./users.service');

class UsersController {
  getUser = async (req, res) => {
    const result = await usersService.getUser(req.params.id);
    res.status(result.status).send({ user: result.body });
  };

  getAllUsers = async (req, res) => {
    console.log('jjsjj');
    const result = await usersService.getAllUsers();
    console.log(result);
    res.status(result.status).send(result.body);
  };

  updateUser = async (req, res) => {
    const result = await usersService.updateUser(req.params.id, req.body);
    res.status(result.status).send({ msg: result.body });
  };

  uploadAvatar = async (req, res) => {
    const result = await usersService.uploadAvatar(req);
    res.status(result.status).send(result.body);
  };

  deleteAvatar = async (req, res) => {
    const result = await usersService.deleteAvatar(req.params.id);
    res.status(result.status).send(result.body);
  };

  uploadAlbum = async (req, res) => {
    const result = await usersService.uploadAlbum(req);
    res.status(result.status).send(result.body);
  };

  deleteImageFromAlbum = async (req, res) => {
    const result = await usersService.deleteImageFromAlbum(
      req.params.id,
      req.body.data,
    );
    res.status(result.status).send(result.body);
  };

  addFriend = async (req, res) => {
    const result = await usersService.userAddFriend(
      req.params.id,
      req.body.userId,
    );
    res.status(result.status).send(result.body);
  };

  deleteFriend = async (req, res) => {
    const result = await usersService.userDeleteFriend(
      req.params.id,
      req.body.userId,
    );
    res.status(result.status).send(result.body);
  };

  followUser = async (req, res) => {
    const result = await usersService.followUser(
      req.params.id,
      req.body.userId,
    );
    res.status(result.status).send(result.body);
  };

  unfollowUser = async (req, res) => {
    const result = await usersService.unfollowUser(
      req.params.id,
      req.body.userId,
    );
    res.status(result.status).send(result.body);
  };

  searchUser = async (req, res) => {
    const result = await usersService.searchUser(req);
    res.status(result.status).send(result.body);
  };

  getUsersFromRegisterDate = async (req, res) => {
    const result = await usersService.getUsersFromRegisterDate(
      req.body.startDate,
      req.body.endDate,
    );
    res.status(result.status).send(result.body);
  };

  deleteUser = async (req, res) => {
    const result = await usersService.deleteUser(req.params.id, req.body);
    res.status(result.status).send(result.body);
  };
}

const usersController = new UsersController();

module.exports = usersController;

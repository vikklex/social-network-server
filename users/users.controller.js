const usersService = require('./users.service');

class UsersController {
  getUser = async (req, res) => {
    const result = await usersService.getUser(req.params.id);
    res.status(result.status).send({ user: result.body });
  };

  deleteUser = async (req, res) => {
    const result = await usersService.deleteUser(req.params.id, req.body);
    res.status(result.status).send(result.body);
  };

  updateUser = async (req, res) => {
    const result = await usersService.updateUser(req.params.id, req.body);
    res.status(result.status).send(result.body);
  };

  uploadAvatar = async (req, res) => {
    const result = await usersService.uploadAvatar(req);
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

    res.status(result.status).send({ msg: result.body });
  };
}

const usersController = new UsersController();

module.exports = usersController;
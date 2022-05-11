const Router = require('express').Router;
const meetingsController = require('./meetings.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = new Router();

router
  .post('/', authMiddleware, meetingsController.createMeeting)
  .get('/:id', /*authMiddleware*/ meetingsController.getAllUserMeetings)
  .put('/:id', authMiddleware, meetingsController.updateMeeting)
  .delete('/:id', meetingsController.deleteMeeting);

module.exports = router;

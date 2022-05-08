const meetingsService = require('./meetings.service');

class MeetingsController {
  createMeeting = async (req, res) => {
    const result = await meetingsService.createMeeting(req.body);
    res.status(result.status).send(result.body);
  };

  getAllUserMeetings = async (req, res) => {
    const result = await meetingsService.getAllUserMeetings(req.params.id);
    res.status(result.status).send(result.body);
  };

  deleteMeeting = async (req, res) => {
    const result = await meetingsService.deleteMeeting(
      req.params.id,
      req.body.userId,
    );
    res.status(result.status).send(result.body);
  };
}

const meetingsController = new MeetingsController();

module.exports = meetingsController;

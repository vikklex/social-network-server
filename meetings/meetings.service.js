const Meeting = require('../models/Meeting');
const User = require('../models/User');

const SERVER_ERROR = { status: '500', body: 'Server error' };

const setMeetingBody = (meeting) => {
  return {
    id: meeting._id,
    userId: meeting.userId,
    participants: meeting.participants,
    title: meeting.title,
    description: meeting.description,
    date: meeting.date,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt,
  };
};

const setUserBody = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
  };
};

class MeetingsService {
  async createMeeting(body) {
    const newMeeting = new Meeting(body);

    try {
      await newMeeting.save();
      return { status: '200', body: setMeetingBody(newMeeting) };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async getAllUserMeetings(id) {
    try {
      const meetings = await Meeting.find({
        $or: [{ userId: id }, { participants: { '$in': [id] } }],
      });

      const result = [];

      for (const meeting of meetings) {
        const participants = [];
        for (const participantId of meeting.participants) {
          await User.findById(participantId).then((user) =>
            participants.push(setUserBody(user)),
          );
        }
        meeting.participants = participants;
      }

      meetings.map((meeting) => {
        result.push(setMeetingBody(meeting));
      });

      return { status: '200', body: result };
    } catch (err) {
      return SERVER_ERROR;
    }
  }

  async deleteMeeting(id, userId) {
    try {
      const meeting = await Meeting.findById(id);

      if (meeting.userId == userId) {
        await meeting.deleteOne();
      } else {
        return {
          status: '403',
          body: 'You have not access to delete this meeting',
        };
      }

      return { status: '200', body: 'Meeting has been deleted' };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
}

const meetingsService = new MeetingsService();

module.exports = meetingsService;

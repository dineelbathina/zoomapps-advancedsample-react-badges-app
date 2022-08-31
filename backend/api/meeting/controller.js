const { Meeting } = require("../../models/Meeting");

module.exports = {
    async getMeeting(req, res) {
        const id = req.params.id;
        const meeting = await Meeting.findOne({ meetingId: id })
        if (!meeting) {
            res.send({error: 'meeting does not exist'});
        } else {
            res.send(meeting);
        }
    },

    async getMeetings(req, res) {
        const screenName = req.params.screenName;
        const meeting = await Meeting.find({ hostUUID: screenName })
        if (!meeting) {
            res.send({error: 'meeting does not exist'});
        } else {
            res.send(meeting);
        }
    },

    async saveMeeting(req, res) {
        let query = {'meetingId' : req.body.meetingId};
        await Meeting.findOneAndUpdate(query, req.body, {upsert: true},);
        return res.send({ status: true })
    },

    async addBadgeToParticipant(req, res) {
        const { meetingId, pid, badge } = req.body;

        const meeting = await Meeting.findOne({ meetingId });
        if (!meeting) {
            res.send({error: 'meeting does not exist'});
        } else {
            meeting.participants = meeting.participants.map((p) => {
                if (p.participantId == pid) {
                    p.badges.push(badge)
                }

                return p;
            })

            await meeting.save();
            res.send(meeting);
        }
    },
    async updateParticipants(req, res) {
        const { meetingId, screenName, participant } = req.body;
        let exists = false;
        const meeting = await Meeting.findOne({ meetingId });
        if (!meeting) {
            res.send({error: 'meeting does not exist'});
        } else {
            meeting.participants = meeting.participants.map((p) => {
                if (p.screenName == screenName) {
                    exists = true;
                }
                return p;
            })
            if(!exists){
                meeting.participants.push(participant);
            }

            await meeting.save();
            res.send(meeting);
        }
    }
}



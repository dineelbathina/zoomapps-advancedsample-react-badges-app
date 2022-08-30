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
    }
}



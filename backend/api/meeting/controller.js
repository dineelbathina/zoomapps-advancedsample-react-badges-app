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
}



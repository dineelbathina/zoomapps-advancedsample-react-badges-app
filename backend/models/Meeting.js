const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let meeting = new Schema({
    meetingTopic: { type: String, required: true },
    meetingId: { type: String, required: true },
    hostUUID: { type: String, required: true},
    participants: [
        {
            screenName: { type: String, required: true },
            participantId: { type: String, required: true },
            participantUUID: { type: String },
            role: String,
            badges: []
        }
    ]
});

const Roles = { STUDENT: 'student', TA: 'ta', INSTRUCTOR: 'instructor'} 
const Meeting =  mongoose.model('Meeting', meeting);
module.exports = { Meeting, Roles }
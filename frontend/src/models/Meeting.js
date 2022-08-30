import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
    meetingTopic: { type: String, required: true },
    meetingId: { type: String, required: true },
    hostUUID: { type: String, required: true},
    participants: [
        {
            screenName: { type: String, required: true },
            participantId: { type: String, required: true },
            participantUUID: { type: String},
            role: String
        }
    ]
});

export const Meeting = mongoose.model('Meeting', meetingSchema);
export const ROLES = { HOST: 'host', ATTENDEE: 'attendee'}
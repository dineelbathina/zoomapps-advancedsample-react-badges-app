import mongoose from "mongoose";
import { Meeting, ROLES } from "./models/Meeting.js";

export const initializeDatabase = async () => {
    /** MongoDB config */
    let uri = 'mongodb://mongo:27017/integrationHackathon';
    let options = { useNewUrlParser: true, useUnifiedTopology: true };

    // event for when the database first connects

    try {
        await mongoose.connect(uri, options);
    } catch(e) {
        throw new Error('could not connect to database', e)
    }
    mongoose.connection.on('connected', () => {

        const createMeetingAndParticipants = async () => {
            const doesMeetingExist = await Meeting.findOne({ meetingId: '0'});

            // if meeting does not exist, insert into db
            if (!doesMeetingExist) {
                await Meeting.create({ 
                    meetingId: '0',
                    meetingTopic: 'class meeting',
                    participants: [
                        { role: ROLES.STUDENT, participantId: '1', screenName: 'Anthony' },
                        { role: ROLES.STUDENT, participantId: '2', screenName: 'Dineel' },
                        { role: ROLES.STUDENT, participantId: '3', screenName: 'Patrick' },
                        { role: ROLES.STUDENT, participantId: '4', screenName: 'Jaimie' },
                        { role: ROLES.STUDENT, participantId: '5', screenName: 'Selena' },
                        { role: ROLES.INSTRUCTOR, participantId: '6', screenName: 'Corey' },
                        { role: ROLES.TA, participantId: '7', screenName: 'Vincent' },

                    ]
                })
            }
        }

        createMeetingAndParticipants();
    })

    // Verify the meeting was created successfully, by uncommenting this, it should log the meeting


    // Meeting.find().then((res) => {
    //      console.log(res)
    // });

}
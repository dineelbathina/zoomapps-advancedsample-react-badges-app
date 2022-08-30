const mongoose = require('mongoose')
const { Meeting, Roles } = require('./models/Meeting');

async function initializeDatabase() {
    /** MongoDB config */
    let uri = 'mongodb://mongo:27017/integrationHackathon';
    let options = { useNewUrlParser: true, useUnifiedTopology: true };

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
                        { role: Roles.STUDENT, participantId: '1', screenName: 'Anthony' },
                        { role: Roles.STUDENT, participantId: '2', screenName: 'Dineel' },
                        { role: Roles.STUDENT, participantId: '3', screenName: 'Patrick' },
                        { role: Roles.STUDENT, participantId: '4', screenName: 'Jaimie' },
                        { role: Roles.STUDENT, participantId: '5', screenName: 'Selena' },
                        { role: Roles.INSTRUCTOR, participantId: '6', screenName: 'Corey' },
                        { role: Roles.TA, participantId: '7', screenName: 'Vincent' },

                    ]
                })
            }
        }

        createMeetingAndParticipants();
    })

}

module.exports = { initializeDatabase }
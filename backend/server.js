
'use strict'


require('./config')


const http = require('http')
const express = require('express')
const morgan = require('morgan')
const { Server } = require("socket.io");

const { initializeDatabase } = require('./db')
const middleware = require('./middleware')

const zoomAppRouter = require('./api/zoomapp/router')
const zoomRouter = require('./api/zoom/router')
const meetingRouter = require('./api/meeting/router')
const thirdPartyOAuthRouter = require('./api/thirdpartyauth/router')
const { Meeting } = require('./models/Meeting')


// Create app
const app = express()
const server = http.createServer(app);
const io = new Server(server);


// Set view engine (for system browser error pages)
app.set('view engine', 'pug')

// Set static file directory (for system browser error pages)
app.use('/', express.static('public'))

// Set universal middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(middleware.session)
app.use(middleware.setResponseHeaders)

// database connection
initializeDatabase();

// Zoom App routes
app.use('/api/zoomapp', zoomAppRouter)
if (
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET &&
  process.env.AUTH0_ISSUER_BASE_URL
) {
  app.use('/api/auth0', thirdPartyOAuthRouter)
} else {
  console.log('Please add Auth0 env variables to enable the /auth0 route')
}

app.use('/zoom', zoomRouter)

// meeting router
app.use('/api/zoomapp/meeting', meetingRouter)


// Handle 404
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// Handle errors (system browser only)
app.use((error, req, res) => {
  res.status(error.status || 500)
  res.render('error', {
    title: 'Error',
    message: error.message,
    stack: error.stack,
  })
})

io.on('connection', (socket) => {
  console.log('a user connected');

  // new event for adding badge

  socket.on('newBadge', async (participantName, meetingId, badge) => {
    const meeting = await Meeting.findOne({ meetingId });
    meeting.participants = meeting.participants.map((p) => {
      if (p.screenName == participantName) {
          p.badges.push(badge)
      }

      return p;
    })
      
    await meeting.save();
  })

  socket.on('newParticipant', async ({ participants }, meetingResponse) => {
    // refresh 
    let meeting = await Meeting.findOne({ meetingId: meetingResponse.meetingID });
    // either add or remove participants
    for (let participant of participants) {
      if (participant.status === 'join') {
        let doesExist = false;
        for (let p of meeting.participants) {
          if (p.screenName == participant.screenName) {
            doesExist = true;
          }
        }

        if (!doesExist) {
          meeting.participants.push({
            screenName: participant.screenName,
            participantUUID: participant.participantUUID,
            participantId: participant.participantId,
            role: 'attendee'
          })
        }

      } else {
        // remove
        // meeting.participants = meeting.participants.filter((p) => {
        //   return p.participantUUID != participant.participantUUID;
        // })
      }
    }

    // save to db
    await meeting.save();

    // send client updated meeting
    io.emit('updatedMeeting', meeting);
  })

});

// Start express server
server.listen(process.env.PORT, () => {
  console.log('Zoom App is listening on port', process.env.PORT)
})

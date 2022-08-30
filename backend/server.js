
'use strict'


require('./config')

const Meeting = require("./models/Meeting");

const http = require('http')
const express = require('express')
const morgan = require('morgan')


const middleware = require('./middleware')

//Database

  /** MongoDB config */
  let uri = 'mongodb://mongo:27017/integrationHackathon';
  let options = { useNewUrlParser: true, useUnifiedTopology: true };

  // event for when the database first connects

  const mongoose = require('mongoose');

  mongoose.connect(uri, options);
 
  mongoose.connection.on('connected', () => {

      const createMeetingAndParticipants = async () => {
          const doesMeetingExist = await Meeting.findOne({ meetingId: '0'});

          // if meeting does not exist, insert into db
          if (!doesMeetingExist) {
              await Meeting.create({ 
                  meetingId: '0',
                  meetingTopic: 'class meeting',
                  hostUUID: 'required',
                  participants: [
                      { role: 'ROLES.STUDENT', participantId: '1', screenName: 'Anthony' },
                      { role: 'ROLES.STUDENT', participantId: '2', screenName: 'Dineel' },
                      { role: 'ROLES.STUDENT', participantId: '3', screenName: 'Patrick' },
                      { role: 'ROLES.STUDENT', participantId: '4', screenName: 'Jaimie' },
                      { role: 'ROLES.STUDENT', participantId: '5', screenName: 'Selena' },
                      { role: 'ROLES.INSTRUCTOR', participantId: '6', screenName: 'Corey' },
                      { role: 'ROLES.TA', participantId: '7', screenName: 'Vincent' },

                  ]
              })
          }
      }

      createMeetingAndParticipants();
    });

const zoomAppRouter = require('./api/zoomapp/router')
const zoomRouter = require('./api/zoom/router')
const thirdPartyOAuthRouter = require('./api/thirdpartyauth/router')
// Create app
const app = express()

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

app.get('/hello', async (req, res) => {
  res.send('Hello Zoom Apps!')
})

app.post('/saveMeeting', async (req, res) => {
  await Meeting.create(req);
  res.send('Hello Zoom Apps!')
})

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

// Start express server
http.createServer(app).listen(process.env.PORT, () => {
  console.log('Zoom App is listening on port', process.env.PORT)
})

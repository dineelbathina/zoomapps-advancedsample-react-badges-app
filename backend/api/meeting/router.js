const { Router } = require('express')
const router = Router()
const controller = require('./controller')
router
  .get('/:id', controller.getMeeting)
  .post('/save', controller.saveMeeting)
  .post('/badge', controller.addBadgeToParticipant)
  .post('/updateParticipants', controller.updateParticipants)
  .get('/meetings/:screenName', controller.getMeetings)
module.exports = router

const { Router } = require('express')
const router = Router()
const controller = require('./controller')
router
  .get('/:id', controller.getMeeting)
  .post('/save', controller.saveMeeting)
  .post('/badge', controller.addBadgeToParticipant)

module.exports = router

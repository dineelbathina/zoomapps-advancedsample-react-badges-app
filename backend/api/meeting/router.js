const { Router } = require('express')
const router = Router()
const controller = require('./controller')
router
  .get('/:id', controller.getMeeting)
  .post('/save', controller.saveMeeting)

module.exports = router

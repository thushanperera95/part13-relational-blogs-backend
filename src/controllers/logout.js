const router = require('express').Router()
const tokenExtractor = require('../middlewares/tokenExtractor')

const Session = require('../models/session')

router.delete('/', tokenExtractor, async (request, response) => {
  await Session.destroy({
    where: {
      userId: request.decodedToken.id
    }
  })

  response.status(204).end()
})

module.exports = router
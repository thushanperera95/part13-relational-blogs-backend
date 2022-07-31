const Session = require('../models/session')
const { User } = require("../models")

const sessionChecker = async (req, res, next) => {
  const existingSession = await Session.findOne({
    where: {
      userId: req.decodedToken.id
    },
    include: {
      model: User
    }
  })

  if (!existingSession) {
    throw {
      name: 'TokenExpiredError'
    }
  }

  if (existingSession.user.disabled) {
    await existingSession.destroy()
    throw {
      name: 'NotAuthorizedError',
      message: 'Your login has been disabled'
    }
  }

  next()
}

module.exports = sessionChecker
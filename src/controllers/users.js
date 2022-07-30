const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attribute: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    include: [{
      model: Blog,
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
    },
    {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: []
      }
    }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    next()
  }
})

router.post('/', async (req, res, next) => {
  if (!(req.body && req.body.username && req.body.name)) {
    throw {
      name: 'CastError',
      message: 'Must provide a valid user to save'
    }
  }

  const user = User.build(req.body)
  await user.save()
  return res.json(user)
})

router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (!req.params.username || !user) {
    next()
  }

  if (!req.body.username) {
    throw {
      name: 'CastError',
      message: 'Must provide a valid username'
    }
  }

  user.username = req.body.username
  await user.save()
  return res.json(user)
})

module.exports = router
const router = require('express').Router()

const { User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(Number(req.params.id))
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.name) {
    next({
      name: 'CastError',
      message: 'Must provide a valid user to save'
    })
  } else {
    const user = User.build(req.body)
    await user.save()
    return res.json(user)
  }
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
    next({
      name: 'CastError',
      message: 'Must provide a valid username'
    })
  }
  else {
    user.username = req.body.username
    await user.save()
    return res.json(user)
  }
})

module.exports = router
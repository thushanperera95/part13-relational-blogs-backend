const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const router = require('express').Router()

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(Number(req.params.id))
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      res.status(401).json({ error: 'token invalid' })
    }
  } else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + req.query.search.toLowerCase() + '%'),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('author')), 'LIKE', '%' + req.query.search.toLowerCase() + '%')
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  if (!(req.body && req.body.url && req.body.title)) {
    throw {
      name: 'CastError',
      message: 'Must provide a valid blog to save'
    }
  }

  const user = await User.findByPk(req.decodedToken.id)
  const blog = Blog.build(req.body)
  blog.userId = user.id
  await blog.save()
  return res.json(blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  if (!req.blog) {
    next()
  }

  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog.userId !== user.id) {
    throw {
      name: 'NotAuthorizedError',
      message: "You cannot delete a blog that you didn't create"
    }
  }

  await Blog.destroy({
    where: {
      id: Number(req.params.id)
    }
  })

  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (!req.blog) {
    next()
  }

  if (!req.body.likes) {
    throw {
      name: 'CastError',
      message: 'Must provide a valid number of likes'
    }
  }

  req.blog.likes = req.body.likes
  await req.blog.save()
  return res.json(req.blog)
})

module.exports = router
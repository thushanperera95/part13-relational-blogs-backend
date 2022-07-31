const router = require('express').Router()

const sessionChecker = require('../middlewares/sessionChecker')
const tokenExtractor = require('../middlewares/tokenExtractor')
const UserBlogs = require('../models/userBlog')

router.get('/', async (req, res) => {
  const readingLists = await UserBlogs.findAll()
  res.json(readingLists)
})

router.post('/', async (req, res) => {
  if (!(req.body && req.body.blogId && req.body.userId)) {
    throw {
      name: 'CastError',
      message: 'Must provide a blog id and user id'
    }
  }

  const userBlog = UserBlogs.build(req.body)
  await userBlog.save()

  return res.json(userBlog)
})

router.put('/:id', tokenExtractor, sessionChecker, async (req, res, next) => {
  if (!req.body) {
    throw {
      name: 'CastError',
      message: 'Must provide a valid read bool'
    }
  }

  const readingList = await UserBlogs.findByPk(Number(req.params.id))
  if (!readingList) {
    next()
  }

  if (readingList.userId != req.decodedToken.id) {
    throw {
      name: 'NotAuthorizedError',
      message: 'You cannot update a reading list that belongs to another user'
    }
  }

  readingList.hasRead = req.body.read
  await readingList.save()

  return res.json(readingList)
})

module.exports = router
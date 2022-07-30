const router = require('express').Router()

const UserBlogs = require('../models/userBlog')

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

module.exports = router
const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(Number(req.params.id))
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  if (!req.body.url || !req.body.title) {
    next({
      name: 'CastError',
      message: 'Must provide a valid blog to save'
    })
  } else {
    const blog = Blog.build(req.body)
    await blog.save()
    return res.json(blog)
  }
})

router.delete('/:id', blogFinder, async (req, res, next) => {
  if (!req.blog) {
    next()
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
    next({
      name: 'CastError',
      message: 'Must provide a valid number of likes'
    })
  }
  else {
    req.blog.likes = req.body.likes
    await req.blog.save()
    return res.json(req.blog)
  }
})

module.exports = router
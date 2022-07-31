const sequelize = require('sequelize')
const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('count', sequelize.col('likes')), 'articles'],
      [sequelize.fn('sum', sequelize.col('likes')), 'likes']
    ],
    group: 'author',
    order: [
      sequelize.literal('likes DESC')
    ]
  })
  res.json(blogs)
})

module.exports = router
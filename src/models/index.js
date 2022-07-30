const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./userBlog')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'readingLists' })

module.exports = {
  Blog,
  User
}
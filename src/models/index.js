const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./userBlog')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'reading_list' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_reading_lists' })

module.exports = {
  Blog,
  User
}
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropColumn('blogs', 'year')
  }
}
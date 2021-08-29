module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('ArticleComments', {
      //   fields: 'ArticleId',
      name: 'ArticleId',

      type: 'foreign key',
      references: {
        table: 'Articles',
        field: 'id',
      },
      onDelete: 'cascade',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ArticleComments');
  },
};

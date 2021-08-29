module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('ArticleTags', {
      fields: ['ArticleId'],
      type: 'foreign key',
      name: 'Articles_ArticleTags_fkey',
      references: {
        table: 'Articles',
        field: 'id',
      },
      onDelete: 'cascade',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'ArticleTags',
      'Articles_ArticleTags_fkey'
    );
  },
};

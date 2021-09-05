module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ArticleComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: 'set null',
      },

      ArticleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Articles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      CommentId: {
        references: {
          model: 'Comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ArticleComments');
  },
};

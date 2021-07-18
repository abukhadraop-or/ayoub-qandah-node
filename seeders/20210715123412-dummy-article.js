module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "articles",
      [
        {
          slug: "aa",
          title: "ss",
          description: "eee",
          body: "edd",
          tag_list: ["dd", "ee"],
          favorited: false,
          favorites_count: 1,
          userId: 1,
          updatedAt: "2021-07-15T10:31:51.780Z",
          createdAt: "2021-07-15T10:31:51.780Z",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

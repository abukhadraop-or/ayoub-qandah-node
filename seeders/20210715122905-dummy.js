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
      "users",
      [
        {
          uuid: "93c97b77-ed7c-4953-8fc7-ff1c8acb9e6e",
          email: "ay222ou2b",
          token: "1a2youb",
          username: "2ay2oub",
          bio: "3ayoub2",
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

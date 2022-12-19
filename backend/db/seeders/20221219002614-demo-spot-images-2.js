'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

options.tableName = 'SpotImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 4,
        url: 'https://theatlasedit.com/wp-content/uploads/2019/02/New-York-Film-Locations-12.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://theatlasedit.com/wp-content/uploads/2019/02/New-York-Film-Locations-1.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://theatlasedit.com/wp-content/uploads/2022/11/image.png',
        preview: false
      },
    ], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [4, 5, 6] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

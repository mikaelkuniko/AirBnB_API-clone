'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: "02-19-22",
        endDate: "02-20-22"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "02-20-22",
        endDate: "02-21-22"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "02-21-22",
        endDate: "02-22-22"
      }
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
      spotId: { [Op.in]: [1,2,3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

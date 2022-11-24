'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1237 South Street',
        city: 'Cerritos',
        state: 'California',
        country: 'USA',
        lat: 23.32,
        lng: 12.45,
        name: 'Quaint 4 bedroom',
        description: 'Good for a small getaway',
        price: 103
      },
      {
        ownerId: 2,
        address: '1839 Hausely street',
        city: 'Garden Grove',
        state: 'California',
        country: 'USA',
        lat: 33.32,
        lng: 42.45,
        name: '2 bedroom apartment',
        description: 'Nice for a quick get away',
        price: 90
      },
      {
        ownerId: 3,
        address: '2139 S. Madely Avenue',
        city: 'Calabasas',
        state: 'California',
        country: 'USA',
        lat: 233.32,
        lng: 121.45,
        name: '14 bedroom mansion',
        description: 'Good for a large gathering',
        price: 3123
      },
    ])
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['California'] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

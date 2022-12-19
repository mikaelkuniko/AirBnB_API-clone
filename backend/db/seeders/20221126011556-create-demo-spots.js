'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1237 South Street',
        city: 'Cerritos',
        state: 'California',
        country: 'USA',
        lat: 23.32,
        lng: 12.45,
        name: 'Urban Getaway',
        description: 'Good for a small getaway',
        price: 103
      },
      {
        ownerId: 2,
        address: '1839 Hausely street',
        city: 'Santa Monica',
        state: 'California',
        country: 'USA',
        lat: 33.32,
        lng: 42.45,
        name: 'Modern Apartment',
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
        name: 'Exclusive Hillside Mansion',
        description: 'Good for a large gathering',
        price: 3123
      },
      {
        ownerId: 3,
        address: '455 Water Street',
        city: 'Brooklyn',
        state: 'New York',
        country: 'USA',
        lat: 23.32,
        lng: 12.45,
        name: 'Urban Apartment',
        description: 'Good for a small getaway',
        price: 133
      },
      {
        ownerId: 2,
        address: '4 East 74th Street',
        city: 'New York City',
        state: 'New York',
        country: 'USA',
        lat: 33.32,
        lng: 42.45,
        name: 'Modern Townhouse',
        description: 'Located in the city',
        price: 201
      },
      {
        ownerId: 1,
        address: '455 Madison Avenue',
        city: 'Midtown East',
        state: 'New York',
        country: 'USA',
        lat: 233.32,
        lng: 121.45,
        name: 'Exclusive penthouse room',
        description: 'Good for a luxurious getaway',
        price: 3123
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
    return queryInterface.bulkDelete(options,
    {
      state: { [Op.in]: ['California', 'New York'] }
    },
     {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

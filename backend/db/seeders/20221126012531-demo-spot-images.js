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
        spotId: 1,
        url: 'https://adorable-home.com/wp-content/uploads/2016/06/Modern-dark-interiors-1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0WgQzEXkPOMzhk0h0ZVrErikZDOu9FtH6hQ&usqp=CAU',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://www.yankodesign.com/images/design_news/2020/06/all-black-interior-designs-that-will-inspire-you-to-adapt-this-modern-minimal-trend/10-Black-Interior-Design-Inspiration_Vipp-Shelter_yankodesign1.jpg',
        preview: false
      },
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
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

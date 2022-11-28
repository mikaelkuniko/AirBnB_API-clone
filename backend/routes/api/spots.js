const express = require('express');
const router = express.Router();

const sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');
const spot = require('../../db/models/spot');

router.get('/', async(req, res, next)=> {
   let spots = await Spot.findAll({
        include: [{
            model: Review,
            attributes: ['stars']
        }, {
            model: SpotImage,
            attributes: ['url']
        }]
    })

    let spotsArr = [];
    // console.log('This is spot', spots.length)
    // console.log('This is spots at index 1', spots[1].dataValues);

    spots.forEach(async element => {
        let sum = await Review.sum('stars',
        {
            where: {
                spotId: element.id
            }
        });
        console.log('Sum', sum)
        let count = await Review.count({
            where: {
                spotId: element.id
            }
        });
        let avg = sum/count
        console.log('This is avg', avg)
        console.log(element.SpotImages[0].dataValues.url)
        let newSpot = {
            id: element.id,
            ownerId: element.ownerId,
            address: element.address,
            city: element.city,
            state: element.state,
            country: element.country,
            lat: element.lat,
            lng: element.lng,
            name: element.name,
            description: element.description,
            price: element.price,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
            avgRating: avg,
            previewImage: element.SpotImages[0].dataValues.url
        }
        console.log(newSpot);
        spotsArr.push(newSpot);
        console.log("this is in the loop", spotsArr)
        if(element === spots[spots.length-1]){
            res.json({
                Spots: spotsArr
            })
        }
    })
})



module.exports = router;

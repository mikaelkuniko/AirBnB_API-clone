const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');
const review = require('../../db/models/review');

// get users current bookings
router.get('/current', requireAuth, async(req,res,next)=> {
    const {user} = req;
    let myBookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: [{
                model: SpotImage,
                attributes: ['url']
            }]
        }]
    })

    let currBookingsArr = [];
    myBookings.forEach(booking => {
        currBookingsArr.push(booking.toJSON())
    })
    currBookingsArr.forEach(booking => {
        let url = booking.Spot.SpotImages[0].url
        booking.Spot.previewImage = url;
        delete booking.Spot.SpotImages
    })
    res.status(200)
    return res.json({
        Bookings: currBookingsArr
    });
})


module.exports = router

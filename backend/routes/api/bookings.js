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

//edit a booking
router.put('/:bookingId', requireAuth, async(req,res,next)=> {
    const {user} = req;
    const {startDate, endDate} = req.body

    let editBooking = await Booking.findOne({
        where: {
            userId: user.id,
            id: req.params.bookingId
        }
    });
    let existsBooking = await Booking.findByPk(req.params.bookingId)
    if(!existsBooking){
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
          })
    }
    if(!editBooking){
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    } else {
        if(endDate <= startDate){
            res.status(400);
            return res.json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                  "endDate": "endDate cannot be on or come before startDate"
                }
              })
        }
        if(editBooking.endDate.getTime() < (new Date()).getTime()){
            res.status(403);
            return res.json({
                "message": "Past bookings can't be modified",
                "statusCode": 403
              })
        }
        if(((editBooking.startDate.getTime() <= (new Date(startDate).getTime())) && ((new Date(startDate).getTime()) <= editBooking.endDate.getTime())) || ((editBooking.startDate.getTime() <= (new Date(endDate).getTime())) && ((new Date(endDate).getTime()) <= editBooking.endDate.getTime()))){
            res.status(403);
            return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                  "startDate": "Start date conflicts with an existing booking",
                  "endDate": "End date conflicts with an existing booking"
                }
              })
        }
        else {
            editBooking.startDate = startDate;
            editBooking.endDate = endDate;
            await editBooking.save();
            res.status(200);
            res.json(editBooking)
        }
    }
})


module.exports = router

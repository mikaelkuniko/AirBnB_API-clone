const express = require('express');
const router = express.Router();

const sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');
const spot = require('../../db/models/spot');
const booking = require('../../db/models/booking');

const validateSpots = [
    check('address')
    .notEmpty()
    .withMessage('Street address is required'),
    check('city')
    .notEmpty()
    .withMessage('City is required'),
    check('state')
    .notEmpty()
    .withMessage('State is required'),
    check('country')
    .notEmpty()
    .withMessage('Country is required'),
    check('lat')
    .notEmpty()
    .isDecimal()
    .withMessage('Latitude is not valid'),
    check('lng')
    .notEmpty()
    .isDecimal()
    .withMessage('Longitude is not valid'),
    check('name')
    .notEmpty()
    .isLength({max:50})
    .withMessage('Name must be less than 50 characters'),
    check('description')
    .notEmpty()
    .withMessage('Description is required'),
    check('price')
    .notEmpty()
    .withMessage('Price per day is required'),
    handleValidationErrors
  ];

  const validateReviews = [
    check('review')
    .notEmpty()
    .withMessage('Review text is required'),
    check('stars')
    .notEmpty()
    .isInt({min:1, max:5})
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

  const validateBookings = [
    check('startDate')
    .notEmpty()
    .isDate()
    .withMessage('Start date must be a date'),
    check('endDate')
    .notEmpty()
    .isDate()
    .withMessage('End date must be a date and cannot be on or before start date'),
    handleValidationErrors
  ];

//get all spots
router.get('/', async(req, res, next)=> {

    // query
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    let pagination = {};
    let pageSize = {};

    if(page){
        if(page > 10 || page < 1){
            res.status(400);
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "page": "Page must be greater than or equal to 1",
                    "size": "Size must be greater than or equal to 1",
                    "maxLat": "Maximum latitude is invalid",
                    "minLat": "Minimum latitude is invalid",
                    "minLng": "Maximum longitude is invalid",
                    "maxLng": "Minimum longitude is invalid",
                    "minPrice": "Maximum price must be greater than or equal to 0",
                    "maxPrice": "Minimum price must be greater than or equal to 0"
                }
            })
        }
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1 || page > 10) page = 1
    }
    if(size) {
        if(size > 20 || size < 1){
            res.status(400);
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                  "page": "Page must be greater than or equal to 1",
                  "size": "Size must be greater than or equal to 1",
                  "maxLat": "Maximum latitude is invalid",
                  "minLat": "Minimum latitude is invalid",
                  "minLng": "Maximum longitude is invalid",
                  "maxLng": "Minimum longitude is invalid",
                  "minPrice": "Maximum price must be greater than or equal to 0",
                  "maxPrice": "Minimum price must be greater than or equal to 0"
                }
              })
        }
        size = parseInt(size);
        if (Number.isNaN(size) || size < 1 || size > 20) size = 20
        pagination.limit = size;
        pagination.offset = size * (page -1 )
        pageSize.page = page;
        pageSize.size = size;
    }
    // minLat = parseFloat(minLat);
    // maxLat = parseFloat(maxLat);
    // minLng = parseFloat(minLng);
    // maxLng = parseFloat(maxLng);
    // minPrice = parseFloat(minPrice);
    // maxPrice = parseFloat(maxPrice);

    if (page > 10 || page < 1 || size > 20 || size < 1 || minPrice < 1 || maxPrice < 1) {
        res.status(400);
        return res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
              "page": "Page must be greater than or equal to 1",
              "size": "Size must be greater than or equal to 1",
              "maxLat": "Maximum latitude is invalid",
              "minLat": "Minimum latitude is invalid",
              "minLng": "Maximum longitude is invalid",
              "maxLng": "Minimum longitude is invalid",
              "minPrice": "Maximum price must be greater than or equal to 0",
              "maxPrice": "Minimum price must be greater than or equal to 0"
            }
          })
    }


    // console.log("this is size", size)



   let spots = await Spot.findAll({
        include: [{
            model: Review,
            attributes: ['stars']
        }, {
            model: SpotImage,
            attributes: ['url']
        }],
        // limit: size,
        // offset: size * (page - 1)
        ...pagination
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
        // console.log('Sum', sum)
        let count = await Review.count({
            where: {
                spotId: element.id
            }
        });
        let avg = sum/count
        // console.log('This is avg', avg)
        // console.log(element.SpotImages[0].dataValues.url)
        // console.log("This is element", element)
        let allSpot = {
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
            // avgRating: avg,
            // previewImage: element.SpotImages[0].dataValues.url

            // limit: element.limit,
            // offset: element.offset

            ...pagination
        }
        if(avg !== NaN) {
            allSpot.avgRating = avg
        } else {
            allSpot.avgRating = "No current ratings"
        }
        if(element.SpotImages[0].dataValues.url){
            allSpot.previewImage = element.SpotImages[0].dataValues.url
        } else {
            allSpot.previewImage = "No current image listed"
        }
        // console.log(allSpot);
        spotsArr.push(allSpot);
        // console.log("this is in the loop", spotsArr)
        if(element === spots[spots.length -1]){
            res.json({
                Spots: spotsArr,
                ...pageSize
            })
        }
    })
})

//create a spot

router.post('/', requireAuth, validateSpots, async(req,res,next)=> {

    const {user} = req

    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    let newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.json(newSpot)
})

//add spotimage to spot id
router.post('/:spotId/images', requireAuth, async(req,res,next)=> {

    let {user} = req;
    let spotId = req.params.spotId;
    let {url, preview} = req.body

    let validSpot = await Spot.findOne({
        where: {
            id: spotId,
            ownerId: user.id
        }
    })
    if(!validSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    } else {
    let newSpotImage = await SpotImage.create({
        spotId: spotId,
        url,
        preview
    })
    return res.json(newSpotImage)
    }

});

// get spot by current user
router.get('/current', requireAuth, async (req,res,next)=>{
    let {user} = req;
    // console.log(user);
    let spots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        include: [{
            model: Review,
            attributes: ['stars']
        }, {
            model: SpotImage,
            attributes: ['url']
        }]
    })
    let ownedSpots = [];
    spots.forEach(async element => {
        let sum = await Review.sum('stars',
        {
            where: {
                spotId: element.id
            }
        });
        let count = await Review.count({
            where: {
                spotId: element.id
            }
        });
        let avg = sum/count
        element.avgRating = avg;
        let allSpot = {
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
        ownedSpots.push(allSpot)
        if(element === spots[spots.length-1]){
            res.json({
                Spots: ownedSpots
            })
        }
    })

})


//get spot by spotId

router.get('/:spotId', async(req,res,next) =>{
    let spotId = req.params.spotId;
    let foundSpot = await Spot.findByPk(spotId);
    if(!foundSpot){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        let count = await Review.count({
            where: {
                spotId: req.params.spotId
            }
        })
        let foundJSON = foundSpot.toJSON()
        foundJSON.numReviews = count;
        let sum = await Review.sum('stars', {
            where: {
                spotId: req.params.spotId
            }
        });
        foundJSON.avgStarRating = (sum/count)
        foundJSON.SpotImages = await SpotImage.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: ['id', 'url', 'preview']
        });
        foundJSON.Owner = await User.findByPk(foundJSON.ownerId, {
            attributes: ["id", "firstName", "lastName"]
        })
        res.status(200);
        return res.json(foundJSON);
    }
})

// edit a spot
router.put('/:spotId', requireAuth, async(req,res,next)=>{
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const {user} = req;
    let validateSpot = await Spot.findOne({
        where: {
            id: req.params.spotId,
            ownerId: user.id
        }
    });
    let spotExists = await Spot.findByPk(req.params.spotId);

    if(!spotExists){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    if(!validateSpot){
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    } else {
        if(address){
            validateSpot.address = address
        }
        if(city){
            validateSpot.city = city
        }
        if(state){
            validateSpot.state = state
        }
        if(country){
            validateSpot.country = country
        }
        if(lat){
            validateSpot.lat = lat
        }
        if(lng){
            validateSpot.lng = lng
        }
        if(name){
            validateSpot.name = name
        }
        if(description){
            validateSpot.description = description
        }
        if(price){
            validateSpot.price = price
        }
        await validateSpot.save();
        res.status(200);
        res.json(validateSpot);
    }

}, validateSpots);

// delete a spot
router.delete('/:spotId', requireAuth, async(req,res,next)=>{
    const {user} = req
    const spotExists = await Spot.findByPk(req.params.spotId);
    const validSpot = await Spot.findOne({
        where: {
            id: req.params.spotId,
            ownerId: user.id
        }
    })
    if(!spotExists) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    if(!validSpot){
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    } else {
        await validSpot.destroy()
        res.status(200);
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
    }

});

// create a review for spot based off spotid
router.post('/:spotId/reviews', requireAuth, validateReviews, async (req,res,next)=>{
    const {user} = req;
    let spotId = req.params.spotId;
    const {review, stars} = req.body
    let validSpot = await Spot.findByPk(spotId);
    if (!validSpot){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    let existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    })
    // console.log(existingReview);
    if (existingReview){
        res.status(403);
        return res.json({
            "message": "User already has a review for this spot",
            "statusCode": 403
          })
    }
    else {
    let newReview = await Review.create({
        userId: user.id,
        spotId,
        review,
        stars
    });
    res.json(newReview)
    }
})

// get all reviews by spot id
// model review images runs into a validation error?
router.get('/:spotId/reviews', async(req,res,next)=> {
    let spotId = req.params.spotId;
    let foundSpots = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    if(foundSpots.length == 0){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    } else {
        res.status(200);
        res.json(foundSpots)
    }
});


//create bookings by spotId
router.post('/:spotId/bookings', requireAuth, async(req,res,next)=> {
    const {user} = req;
    const {startDate, endDate} = req.body;
    const spotId = req.params.spotId
    let spotOwned = await Spot.findOne({
        where: {
            id: spotId,
            ownerId: user.id
        }
    })
    let spotExists = await Spot.findByPk(spotId);
    if(!spotExists){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          });
    }
    if(spotOwned){
        res.status(403);
        return res.json({
            message: "You own this spot",
            statusCode: 403
        })
    }
    if(endDate <= startDate){
        res.status(400);
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
              "endDate": "endDate cannot be on or before startDate"
            }
          })
    }
    let checkBooking = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })
    // console.log(checkBooking)
    const checkDates = [];

    if(!checkBooking){
        let newBooking = await Booking.create({
            spotId,
            userId: user.id,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        })
        return res.json(newBooking)
    };

    checkBooking.forEach(booking=>{
        checkDates.push(booking.toJSON())
    });

    // console.log('this is checkDates', checkDates);

    // console.log("this is checking if between dates", checkDates.every(booking => {(booking.startDate.getTime() <= (new Date(startDate)).getTime() >= booking.endDate.getTime()) || (booking.startDate.getTime() <= (new Date(endDate)).getTime() >= booking.endDate.getTime())}))
    // console.log('This is comparing dates', (new Date('2022-02-20')).getTime() > (new Date('2022-01-01')).getTime());
    // console.log((new Date('2022-02-20')).getTime())
    // console.log((new Date('2022-01-01')).getTime())
    // console.log("This is checking between example dates", (((new Date('2022-01-01')).getTime()) <= ((new Date('2022-01-02')).getTime())) && (((new Date('2022-01-02')).getTime()) >= ((new Date('2022-01-03')).getTime())))

    // returns a boolean value if start date / end date is within any of the current bookings for this spot
    // console.log("This is spotId", spotId);
    // console.log("This is userId", user.id);
    // console.log("This is startDate", new Date(startDate));
    // console.log("This is endDate", new Date(endDate));
    // let start = new Date('2022-01-07').getTime()
    // let checkin = new Date('2022-01-10').getTime()
    // let end = new Date('2022-01-09').getTime()
    // console.log("Does checkin start after start date?", checkin>=start)
    // console.log("Does checkin start before end date?", checkin<=end)
    // console.log("Is checkin between start and end", ((start <= checkin) && (checkin <= end)))

    // let validBookingDate = checkDates.every(booking => {
    //     ((booking.startDate.getTime <= (new Date(startDate).getTime())) && ((new Date(startDate).getTime()) <= booking.endDate.getTime())) || ((booking.startDate.getTime <= (new Date(endDate).getTime())) && ((new Date(endDate).getTime()) <= booking.endDate.getTime()))
    // })
    // ^ that works
    // console.log(checkDates)
    // console.log("this is startDate", new Date(startDate))
    // console.log("this is startDate", new Date(endDate))
    // console.log('IS the startdate between start and end of any bookings',validBookingDate)

    // let validBookingDate = checkDates.every(booking => {
    //     ((booking.startDate.getTime <= (new Date(startDate).getTime())) && ((new Date(startDate).getTime()) <= booking.endDate.getTime())) || ((booking.startDate.getTime() <= (new Date(endDate).getTime())) && ((new Date(endDate).getTime()) <= booking.endDate.getTime()))
    // })
    // console.log(validBookingDate)

    // if(!validBookingDate){
    //     let newBooking = await Booking.create({
    //         spotId,
    //         userId: user.id,
    //         startDate: new Date(startDate),
    //         endDate: new Date(endDate)
    //     })
    //     return res.json(newBooking)
    // } else {
    //     res.status(403);
    //     return res.json({
    //         "message": "Sorry, this spot is already booked for the specified dates",
    //         "statusCode": 403,
    //         "errors": {
    //           "startDate": "Start date conflicts with an existing booking",
    //           "endDate": "End date conflicts with an existing booking"
    //         }
    //       })
    // }
    checkDates.forEach(booking => {
        if(((booking.startDate.getTime() <= (new Date(startDate).getTime())) && ((new Date(startDate).getTime()) <= booking.endDate.getTime())) || ((booking.startDate.getTime() <= (new Date(endDate).getTime())) && ((new Date(endDate).getTime()) <= booking.endDate.getTime()))){
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
    })

    let newBooking = await Booking.create({
            spotId,
            userId: user.id,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        })
        return res.json(newBooking)

})

//get bookings for a spot based of spotid
router.get('/:spotId/bookings', requireAuth, async(req,res,next)=>{
    const {user} = req;
    const spotId = req.params.spotId;
    let ownedSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    // console.log('This is owned spots', ownedSpots[0].dataValues.id);
    let ownedSpotIds = [];

    ownedSpots.forEach(spot => {
        ownedSpotIds.push(spot.dataValues.id)
    })
    let validSpot = await Spot.findByPk(spotId)
    if(!validSpot){
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    // console.log(ownedSpotIds);
    // console.log("this is owned spot ids", ownedSpotIds);
    // console.log("this is spotId", spotId)
    // console.log("IS this true", ownedSpotIds.includes(spotId));
    if(!ownedSpotIds.includes(spotId)){
        let spotBookings = await Booking.findAll({
            where: {
                spotId: spotId
            }
        })
        res.status(200);
        return res.json({
            Bookings: spotBookings
        })
    } else {
        let ownedSpotBookings = await Booking.findAll({
            where: {
            spotId: spotId
        },
            include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }]
    })
    res.status(200);
    return res.json({
        Bookings: ownedSpotBookings
        })
    }
    // console.log(spotBookings)

    // res.json({
    //     message: "hello"
    // })

})

module.exports = router;

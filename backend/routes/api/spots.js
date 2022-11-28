const express = require('express');
const router = express.Router();

const sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');
const spot = require('../../db/models/spot');

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

//get all spots
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
        // console.log('Sum', sum)
        let count = await Review.count({
            where: {
                spotId: element.id
            }
        });
        let avg = sum/count
        // console.log('This is avg', avg)
        // console.log(element.SpotImages[0].dataValues.url)
        console.log("This is element", element)
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
        console.log(allSpot);
        spotsArr.push(allSpot);
        console.log("this is in the loop", spotsArr)
        if(element === spots[spots.length-1]){
            res.json({
                Spots: spotsArr
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
            }
        });
        foundJSON.Owner = await User.findByPk(foundJSON.ownerId, {
            attributes: ["id", "firstName", "lastName"]
        })
        res.status(200);
        return res.json(foundJSON);
    }
})

// get spot by current user
router.get('/current', requireAuth, async (req,res,next)=>{
    let {user} = req;
    console.log(user);
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



module.exports = router;

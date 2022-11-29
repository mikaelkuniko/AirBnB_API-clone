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

router.delete('/:imageId', requireAuth, async(req,res,next)=>{
    const {user} = req;
    let deleteSpotImg = await SpotImage.findByPk(req.params.imageId)
    // console.log("This is spotId", deleteSpotImg.spotId)
    // console.log("This is user Id", user.id)
    let ownedSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })
    let ownedSpotIds = [];

    ownedSpots.forEach(spot => {
        ownedSpotIds.push(spot.dataValues.id)
    })
    let validSpotImage = await SpotImage.findByPk(req.params.imageId)
    if(!validSpotImage){
        res.status(404);
        return res.json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
          })
    }
    // console.log(ownedSpotIds);
    // console.log(!ownedSpotIds.includes(deleteSpotImg.spotId))
    if(!ownedSpotIds.includes(deleteSpotImg.spotId)){
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    } else {
        await deleteSpotImg.destroy();
        res.status(200);
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
    }
})

module.exports = router;

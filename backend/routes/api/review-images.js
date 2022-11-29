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
    let deleteReviewImg = await ReviewImage.findByPk(req.params.imageId)

    // console.log(deleteReviewImg);
    // console.log("userid", user.id)

    let ownedReviews = await Review.findAll({
        where: {
            userId: user.id
        }
    })
    let ownedReviewsIds = [];

    ownedReviews.forEach(review => {
        ownedReviewsIds.push(review.dataValues.id)
    })

    // console.log(ownedReviewsIds)


    if(!deleteReviewImg){
        res.status(404);
        return res.json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
          })
    }
    if(ownedReviewsIds.includes(deleteReviewImg.reviewId)){
        await deleteReviewImg.destroy()
        res.status(200);
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
        }
    else {
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

})

module.exports = router;

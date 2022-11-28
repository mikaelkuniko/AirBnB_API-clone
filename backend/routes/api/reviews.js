const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');


// get current users reviews // not done!!
router.get("/current", requireAuth, async(req,res,next)=>{
    const { user } = req;
    const allReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country'],
            include: [{
                model: SpotImage,
                attributes: ['url']
            }]
        }, {
            model: ReviewImage
        }]
    });
    res.status(200);
    return res.json(allReviews);
});

//add an image to a review based off reviewid
// running into interger error?
router.post('/:reviewId/images', requireAuth, async(req,res,next)=> {
    let {user} = req;
    let reviewId = req.params.reviewId;
    let {url} = req.body

    let validReview = await Review.findByPk(reviewId);
    if(!validReview){
        res.status(404);
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }
    let count = await Review.count({
        where: {
            id: reviewId
        }
    });
    console.log('this is count', count);
    if(count > 10){
        res.status(403);
        return res.json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
          })
    } else {
        let newReviewImage = await ReviewImage.create({
            reviewId,
            url
        })
        res.status(200);
        res.json(newReviewImage)
    }
})






module.exports = router;

const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');
const review = require('../../db/models/review');

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


// get current users reviews // not done!!
router.get("/current", requireAuth, async(req,res,next)=>{
    const { user } = req;
    const allReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: [{
                model: SpotImage,
                attributes: ['url']
            }]
        },
        {
            model: ReviewImage,
            attributes: ['id', 'url']
        }
        //when uncommented results in validation error no field?
        //fixed with adding id into model files for review and review images
    ]
    });

    console.log(allReviews);

    let reviewArr = [];

    allReviews.forEach(review => {
        reviewArr.push(review.toJSON())
    })

    console.log(reviewArr)
    reviewArr.forEach(review=>{
        let url = review.Spot.SpotImages[0].url;
        console.log(url)
        review.Spot.previewImage = url
        delete review.Spot.SpotImages;
    })

    res.status(200);
    return res.json({
        Reviews: reviewArr
    });
});


//add an image to a review based off reviewid
// have not finished count > 10
//used .length instead
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
    // let count = await Review.count({
    //     where: {
    //         id: reviewId
    //     }
    // });
    // console.log('this is count', count);
    let allReviewImages = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    });

    if(allReviewImages.length > 10){
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

// edit a review
//validate reviews not functioning // can refactor
router.put('/:reviewId', requireAuth, async(req,res,next)=> {
    const {user} = req;
    const {review, stars} = req.body;

    const editReview = await Review.findByPk(req.params.reviewId)
    const validReview = await Review.findOne({
        where: {
            id: req.params.reviewId,
            userId: user.id
        }
    })

    if(!editReview){
        res.status(404);
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }
    if(!validReview){
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
          })
    } else {
        if(review.length === 0 || stars > 5 || stars < 1){
            res.status(400);
            return res.json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                  "review": "Review text is required",
                  "stars": "Stars must be an integer from 1 to 5",
                }
              })
        }
        if(review){
            validReview.review = review
        }
        if(stars){
            validReview.stars = stars
        }
        await validReview.save();
        res.status(200);
        return res.json(validReview)
    }


}, validateReviews)


// delete reviews
router.delete('/:reviewId', requireAuth, async(req,res,next)=>{
    const {user} = req;
    let deleteReview = await Review.findByPk(req.params.reviewId);
    if(!deleteReview){
        res.status(404);
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }
    if(user.id !== deleteReview.userId){
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    } else {
       await deleteReview.destroy();
       res.status(200);
       res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    }
})




module.exports = router;

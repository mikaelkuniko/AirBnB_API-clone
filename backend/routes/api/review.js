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








module.exports = router;

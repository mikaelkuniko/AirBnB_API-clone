import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {getSingleSpot} from '../../store/spots'
import {useHistory} from 'react-router-dom'
import { removeSpot } from '../../store/spots';
import { getAllSpotReviews } from '../../store/reviews';
import ReviewCard from '../ReviewsCards';

const SpotDetail = () => {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const history = useHistory()

    const editRouteRedirect = () => {
        history.push(`/spots/${spotId}/edit`)
    }

    const addReviewRedirect = () => {
        history.push(`/spots/${spotId}/reviews/new`)
    }

    const deleteLocation = () => {
       dispatch(removeSpot(spotId));
       history.push(`/`);
    }

    const spot = useSelector((state)=>state.spots.singleSpot)
    console.log('This is spot details', spot)
    // This takes the slice of state of spots : {singleSpot: {}}
    let spotImages = spot.SpotImages
    // console.log("this is spot images from spot details", spotImages)

    // all reviews for spots
    const reviews = useSelector((state)=>state.reviews.spot)
    console.log('This is reviews', reviews)

    const reviewsArr = Object.values(reviews)
    console.log("this is reviewsArr", reviewsArr)

    useEffect(()=> {
        dispatch(getSingleSpot(spotId))
        dispatch(getAllSpotReviews(spotId))
    },[spotId, dispatch])

    if(!spotImages) return null
    return(
        <div>
            <div>
            <h1>{spot.name} in {spot.city}, {spot.state}</h1>
            <p>Average Rating: {spot.avgStarRating ? spot.avgStarRating : 'New location'}</p>
            <p>Reviews: {spot.numReviews ? spot.numReviews : 'New location'}</p>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            </div>
            <div>
            {spotImages.map((image)=>(
                // console.log(image.url)
                <div key={image.id}>
                    <img src={image.url} alt='spot image'/>
                </div>
            ))}
            </div>
            <div>
                <p>{spot.description}</p>
                <p>${spot.price} per night</p>
            </div>
            <div>
                <h3>{reviewsArr.length ? `${reviewsArr.length} Reviews` : 'No reviews available'}</h3>
                <ul>
                {reviewsArr.map((review)=>(
                    // <li key={id}><NavLink to={`/spots/${id}`}>{name}</NavLink></li>
                    <ReviewCard key={review.id} {...review} />
                ))}
                </ul>
            </div>
            <div>
                <button onClick={editRouteRedirect}>Edit Location</button>
            </div>
            <div>
                <button onClick={deleteLocation}>Delete location</button>
            </div>
            <div>
                <button onClick={addReviewRedirect}>Add Review</button>
            </div>
        </div>

    )
}

export default SpotDetail

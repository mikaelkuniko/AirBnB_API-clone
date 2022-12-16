import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {getSingleSpot} from '../../store/spots'
import {useHistory} from 'react-router-dom'
import { removeSpot } from '../../store/spots';
import { getAllSpotReviews } from '../../store/reviews';
import ReviewCard from '../ReviewsCards';
import './SpotDetails.css'

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
    // console.log('This is spot details', spot)
    // This takes the slice of state of spots : {singleSpot: {}}
    let spotImages = spot.SpotImages
    // console.log("this is spot images from spot details", spotImages)

    // all reviews for spots
    const reviews = useSelector((state)=>state.reviews.spot)
    // console.log('This is reviews', reviews)

    const reviewsArr = Object.values(reviews)
    // console.log("this is reviewsArr", reviewsArr)

    const state = useSelector(state=>state)
    console.log("this is state",state)
    let session = state.session
    let owner = state.spots.singleSpot.Owner
    console.log("This is spot owner", owner)
    console.log("Check user", session.user)
    console.log("Check session", session)

    // console.log('is this true', owner.id === session.user.id)

    // const buttonShow = (session.user || owner.id === session.user.id ? "" : " hidden");
    const buttonShow = (session.user ? "" : " hidden");

    useEffect(()=> {
        // console.log("Nothing was")
        dispatch(getSingleSpot(spotId))
        // console.log('get spot ran')
        dispatch(getAllSpotReviews(spotId))
        // console.log("reviews grabbed")
    },[spotId, dispatch])


    //testing how site renders
    // useEffect(()=>{

    // }, [reviews])

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
                <button onClick={editRouteRedirect} className={buttonShow}>Edit Location</button>
            </div>
            <div>
                <button onClick={deleteLocation} className={buttonShow}>Delete location</button>
            </div>
            <div>
                <button onClick={addReviewRedirect} className={buttonShow}>Add Review</button>
            </div>
        </div>

    )
}

export default SpotDetail

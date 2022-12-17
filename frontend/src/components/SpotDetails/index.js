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
    // console.log("this is state",state)
    let user = useSelector(state=>state.session.user)
    let owner = useSelector(state=> state.spots.singleSpot.Owner)
    // console.log("This is spot owner", owner)
    // console.log("Check user", user)

    // console.log('is this true', owner.id === session.user.id)

    // const buttonShow = (session.user || owner.id === session.user.id ? "" : " hidden");
    // const ownedSpot = (owner.id === session.user.id ? "" : " hidden")
    const buttonShow = (user ? "" : " hidden");
    // const buttonShow = (session.user ? ownedSpot : " hidden");

    useEffect(()=> {
        // console.log("Nothing was")
        dispatch(getSingleSpot(spotId))
        // console.log('get spot ran')
        dispatch(getAllSpotReviews(spotId))
        // console.log("reviews grabbed")
    },[spotId, dispatch])

    const userLoggedIn = !!user
    // console.log('this is user log in', userLoggedIn)
    let ownedButton;
   if(userLoggedIn && !!owner){
    console.log('This is user in if cond', user)
    console.log('This is owner in if cond', owner)
    if(user.id === owner.id){
        ownedButton = <div className="owned">
            <div>
            <button onClick={editRouteRedirect}>
                Edit Location
            </button>
            </div>
            <div>
                <button onClick={deleteLocation}>
                    Delete Location
                </button>
            </div>
        </div>
    }
    else {
        ownedButton= <div className='unowned'>
            <button onClick={addReviewRedirect}>Add Review</button>
        </div>
    }
   } else {
    ownedButton = <div></div>
   }


    //testing how site renders
    // useEffect(()=>{

    // }, [reviews])

    if(!spotImages) return null
    // if(!owner || !user.id) return null

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
            {ownedButton}
            {/* {(user.id === owner.id) && <div className="owned">
            <div>
                <button onClick={editRouteRedirect}>Edit Location</button>
            </div>
            <div>
                <button onClick={deleteLocation}>Delete location</button>
            </div>
                </div>
                }
                {(user.id !== owner.id) && <div className="unowned">
            <div>
                <button onClick={addReviewRedirect} className={buttonShow}>Add Review</button>
            </div>
                    </div>} */}
        </div>

    )
}

export default SpotDetail

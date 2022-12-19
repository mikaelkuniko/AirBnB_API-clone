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

    let reviewExists;
    // console.log('this is a boolean', !!reviewExists)


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
    let reviewButton;
   if(userLoggedIn && !!owner && !!reviews && !!user){
    reviewExists = reviewsArr.find((review)=>review.User.id === user.id)
    // console.log('This is user in if cond', user)
    // console.log('This is owner in if cond', owner)
    if(user.id === owner.id){
        ownedButton = <div className="owned">
            <div>
            <button className="alphabnb-button"onClick={editRouteRedirect} id='edit-button'>
                Edit Location
            </button>
            </div>
            <div>
                <button className="alphabnb-button" onClick={deleteLocation} id='delete-button'>
                    Delete Location
                </button>
            </div>
        </div>
    }
    else {
        if(!!reviewExists){
            reviewButton=<></>
            //add edit review functionality here
        } else {
        // ownedButton= <div className='unowned'>
        //     <button className="alphabnb-button" onClick={addReviewRedirect}>Add Review</button>
        // </div>
        reviewButton= <div className='unowned'>
            <button className="alphabnb-button" onClick={addReviewRedirect}>Add Review</button>
        </div>
        }
    }
   } else {
    ownedButton = <></>
    reviewButton = <></>
   }


    //testing how site renders
    // useEffect(()=>{

    // }, [reviews])

    if(!spotImages) return null
    // if(!owner || !user.id) return null

    return(
        <div className='spot-details-div'>
            <div className='title-info-div'>
                <div className='left-info-div'>
                    <h1>{spot.name}</h1>
                     <p><i class="fa-sharp fa-solid fa-star"/> {spot.avgStarRating ? spot.avgStarRating : 'New location'} ·
                     {spot.numReviews ? spot.numReviews : 'No available'} reviews
                     · {spot.city}, {spot.state}, {spot.country}
                     </p>
                </div>
                <div className='right-info-div'>
                     {ownedButton}
                </div>
            {/* <p>{spot.numReviews ? spot.numReviews : 'New location'}</p>
            <p>{spot.city}, {spot.state}, {spot.country}</p> */}
            </div>
            <div className='spot-images-div'>
            {spotImages.map((image)=>(
                // console.log(image.url)
                <div key={image.id}>
                    <img src={image.url} alt='spot image' className='spot-details-image'/>
                </div>
            ))}
            </div>
            <div className='info-price-div'>
            <div className='host-info'>
                <h3>Entire location hosted by {owner.firstName} {owner.lastName}</h3>
                <p>{spot.description}</p>
            </div>
            <div className='price-info'>
                <p>${spot.price} per night</p>
                <p><i class="fa-sharp fa-solid fa-star"/> {spot.avgStarRating ? spot.avgStarRating : 'New location'} ·
            {spot.numReviews ? spot.numReviews : 'No available'} reviews</p>
            </div>
            </div>
            <div className='reviews-div'>
            <div className='review-cards-div'>
                <h3>{reviewsArr.length ? `${reviewsArr.length} Reviews` : 'No reviews available'}</h3>
                <ul>
                {reviewsArr.map((review)=>(
                    // <li key={id}><NavLink to={`/spots/${id}`}>{name}</NavLink></li>
                    <ReviewCard key={review.id} {...review} />
                ))}
                </ul>
            </div>
            {/* {ownedButton} */}
            {reviewButton}
            </div>
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

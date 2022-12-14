import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {getSingleSpot} from '../../store/spots'
import {useHistory} from 'react-router-dom'
import { removeSpot } from '../../store/spots';

const SpotDetail = () => {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const history = useHistory()

    const editRouteRedirect = () => {
        history.push(`/spots/${spotId}/edit`)
    }

    const deleteLocation = () => {
       dispatch(removeSpot(spotId));
       history.push(`/`);
    }

    const spot = useSelector((state)=>state.spots.singleSpot)
    console.log('This is spot', spot)
    // This takes the slice of state of spots : {singleSpot: {}}
    let spotImages = spot.SpotImages
    console.log("this is spot images", spotImages)

    useEffect(()=> {
        dispatch(getSingleSpot(spotId))
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
                <button onClick={editRouteRedirect}>Edit Location</button>
            </div>
            <div>
                <button onClick={deleteLocation}>Delete location</button>
            </div>
        </div>

    )
}

export default SpotDetail

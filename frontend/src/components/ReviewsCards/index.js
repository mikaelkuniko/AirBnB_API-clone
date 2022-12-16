import { useState, useEffect } from 'react';
import { NavLink} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {useHistory} from 'react-router-dom'
import { removeReview } from '../../store/reviews';

const ReviewCard = ({User, review, stars, Spot, id, spotId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    let reviewId = id
    // console.log('this is the reviewId',reviewId)
    console.log("this is spotId", spotId)

    const deleteReview = () => {
        dispatch(removeReview(reviewId));
        if(!!Spot) history.push('/user/reviews')
        else history.push(`/spots/${spotId}`)
    }

    return (
        <div>
            <div>
                {!Spot ? <h4>{User.firstName} {User.lastName}</h4>: ''}
                {!!Spot ? <NavLink to={`/spots/${Spot.id}`}><h4>{Spot.name}</h4></NavLink> : ''}
            </div>
            <div>
                <p>{stars} stars</p>
                <p>{review}</p>
            </div>
            <div>
                <button onClick={deleteReview}>Delete Review</button>
            </div>
        </div>
    );
  };

  export default ReviewCard;

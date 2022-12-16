import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import { useHistory } from "react-router-dom";
import { getAllUserReviews } from "../../store/reviews";
import ReviewCard from "../ReviewsCards";

const UserReviews = () =>{
    const dispatch = useDispatch();
    const reviews = useSelector((state)=>state.reviews.user)
    const reviewsArr = Object.values(reviews)
    // console.log("Reviews:", reviews)

    useEffect(()=>{
        dispatch(getAllUserReviews())
    },[dispatch])


    return(
        <div>
            <h1>User Reviews</h1>
            <ul>
                {reviewsArr.map((review)=>(
                    // <li key={id}><NavLink to={`/spots/${id}`}>{name}</NavLink></li>
                    <ReviewCard key={review.id} {...review} />
                ))}
                </ul>
        </div>
    )
}

export default UserReviews

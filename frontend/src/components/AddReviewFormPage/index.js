import {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews'
import { useHistory, useParams } from 'react-router-dom';
import './AddReviewForm.css'

const AddReviewForm = () => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const history = useHistory()
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState([]);
    // const [reviewExists, setReviewExists] = useState(false)
    const {spotId} = useParams()

    // console.log("this is spotId", spotId)

    useEffect(()=> {
        const errors = [];
        //do the errors!!
        if(stars<0) errors.push("Stars must be greater than 0")
        if(stars>5) errors.push("Stars must be less than 5")
        if(review.length === 0) errors.push("Review can not be empty")
        setErrors(errors);
      }, [stars,review])

      useEffect(()=> {

      }, [errors])

      useEffect(()=> {
        dispatch(reviewActions.getAllSpotReviews(spotId))
      }, [dispatch])

        const currentUser = useSelector((state)=>state.session.user)
        const reviews = useSelector((state)=>state.reviews.spot)
        // console.log('This is reviews', reviews)
        // console.log('This is currentUser', currentUser)

        const reviewsArr = Object.values(reviews)
        //  console.log("this is reviewsArr", reviewsArr)

    //   reviewsArr.forEach((review)=> {
    //     if(review.User.id === currentUser.id)
    //     return setReviewExists(true)
    //     else return
    //   })
        const reviewExists = reviewsArr.find((review)=>review.User.id === currentUser.id)
        // console.log('this is a boolean', reviewExists)

      const handleSubmit = (e) => {
        e.preventDefault()
        let reviewObj = {review,stars}
        return dispatch(reviewActions.addReview(reviewObj, spotId))
            .then(() => history.push(`/spots/${spotId}`))
      }

    // possible redirect to edit review for the future
    // if(!!reviewExists) return alert('You have already reviewed this location!')
    //     .then(() => history.push(`/spots/${spotId}`))
    return (
        <>
      <div className='outer-div'>
      <div className='add-review-div'>
      <h3 id='add-review-text'>Add Review</h3>
      <form onSubmit={handleSubmit} className='add-review-form'>
        {/* {!!reviewExists ? <h2>You have already reviewed this location</h2> : ''} */}
        {/* {!!reviewExists (<h2>You have already reviewed this location</h2>)} */}
          <div className='add-review-inputs'>
            <p>Review</p>
        <label>
          <textarea
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            placeholder='Add a review'
            id='review-input'
          />
        </label>
        <p>Stars</p>
        <label>
          <input
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
            id='stars-input'
          />
        </label>
        </div>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <button type="submit" className='alphabnb-button' id='add-review-button'
        disabled={!!errors.length}>Add Review</button>
      </form>
      </div>
      </div>
    </>
    )
}

export default AddReviewForm

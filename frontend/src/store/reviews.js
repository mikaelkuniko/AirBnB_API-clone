import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = "reviews/LOAD_SPOT_REVIEWS";
const LOAD_SINGLE_REVIEW = "reviews/LOAD_SINGLE_REVIEW";
const LOAD_USER_REVIEWS = "reviews/LOAD_USER_REVIEWS"
const ADD_REVIEW = "reviews/ADD_REVIEW"
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW"

const loadSpotReviews = (reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
})

const loadUserReviews = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    reviews
})

const loadSingleReview = (review) => ({
    type: LOAD_SINGLE_REVIEW,
    review
})

const add = (review) => ({
    type: ADD_REVIEW,
    review
})

const remove = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
})

export const getAllSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    // console.log('fetch obtained for all spots reviews')
    if(response.ok){
        const reviews = await response.json();
        dispatch(loadSpotReviews(reviews))
    }
}

export const getAllUserReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`)

    if(response.ok){
        const reviews = await response.json();
        dispatch(loadUserReviews(reviews))
    }
}

// export const getSingleReview = (reviewId) => async dispatch => {
//     const response = await csrfFetch(`/api/reviews/${reviewId}`)

//     if(response.ok){
//         const foundReview = await response.json();
//         dispatch(loadSingleReview(foundReview))
//     }
// }

    export const addReview = (addedReview, spotId) => async dispatch => {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(addedReview)
          });

          if(response.ok){
            const newReview = await response.json();
            dispatch(add(newReview))
            return newReview
          }
    }

    export const removeReview = (reviewId) => async dispatch =>{
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
          if(response.ok){
            const deletedReview = await response.json();
            dispatch(remove(reviewId))
            return deletedReview
          }
      }


const initialState = {
    spot: {},
    user: {}
}

const reviewsReducer = (state = initialState, action) => {
    let newState;
    let newSpot = {};
    let newUser = {};
    switch(action.type){
        case LOAD_SINGLE_REVIEW:
            newState = {...state};
            // complete reducer
            return newState
        case LOAD_SPOT_REVIEWS:
            newState = {...state};
            // console.log('this is action reviews', action.reviews)
            action.reviews.Reviews.forEach(review => {
                newSpot[review.id] = review;
            })
            newState.spot = newSpot
            // complete reducer
            return newState
        case LOAD_USER_REVIEWS:
            newState = {...state};
            action.reviews.Reviews.forEach(review => {
                newUser[review.id] = review;
            })
            newState.user = newUser
            // complete reducer
            return newState
        case LOAD_SINGLE_REVIEW:
            newState = {...state};
            newSpot = {...state.spot, [action.review.id]:action.review}
            // complete reducer
            newState.spot = newSpot
            return newState
        case REMOVE_REVIEW:
            newState = {...state};
            newUser = {...state.user}
            newSpot = {...state.spot}
            delete newUser[action.reviewId]
            delete newSpot[action.reviewId]
            newState.user = newUser
            newState.spot = newSpot
            return newState
        default:
            return state;
    }
}

export default reviewsReducer

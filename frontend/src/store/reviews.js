import { csrfFetch } from './csrf';

const LOAD_SPOT_REVIEWS = "reviews/LOAD_SPOT_REVIEWS";
const LOAD_SINGLE_REVIEW = "reviews/LOAD_SINGLE_REVIEW";
const LOAD_USER_REVIEWS = "reviews/LOAD_USER_REVIEWS"
const ADD_REVIEW = "reviews/ADD_REVIEW"
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW"

const loadSpotReviews = (spot) => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
})

const loadUserReviews = (user) => ({
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
    const response = await csrfFetch(`/spots/${spotId}/reviews`)

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

export const getSingleReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`)

    if(response.ok){
        const foundReview = await response.json();
        dispatch(loadSingleReview(foundReview))
    }
}

const initialState = {
    spot: {},
    user: {}
}

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case LOAD_SINGLE_REVIEW:
            newState = {...state};
            // complete reducer
            return newState

    }
}
